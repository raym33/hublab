use clap::{Parser, Subcommand};
use colored::*;
use hublab_engine::{load_capsules_from_json, CapsuleIndex, SearchConfig, SearchQuery};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "hublab")]
#[command(about = "HubLab Rust Engine CLI", long_about = None)]
#[command(version)]
struct Cli {
    /// Path to the capsules JSON file
    #[arg(short, long, default_value = "../data/all-capsules.json")]
    data_path: PathBuf,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Search for capsules
    Search {
        /// Search query
        query: String,

        /// Filter by category
        #[arg(short, long)]
        category: Option<String>,

        /// Filter by platform
        #[arg(short, long)]
        platform: Option<String>,

        /// Filter by tags (comma-separated)
        #[arg(short, long)]
        tags: Option<String>,

        /// Enable fuzzy search
        #[arg(short, long)]
        fuzzy: bool,

        /// Maximum number of results
        #[arg(short, long, default_value = "20")]
        limit: usize,

        /// Output as JSON
        #[arg(long)]
        json: bool,
    },

    /// Get a specific capsule by ID
    Get {
        /// Capsule ID
        id: String,

        /// Output as JSON
        #[arg(long)]
        json: bool,
    },

    /// List all categories
    Categories,

    /// List all tags
    Tags {
        /// Maximum number of tags to show
        #[arg(short, long, default_value = "50")]
        limit: usize,
    },

    /// Show statistics
    Stats,
}

fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("warn")),
        )
        .init();

    let cli = Cli::parse();

    // Load capsules
    let capsules = load_capsules_from_json(&cli.data_path)?;
    let index = CapsuleIndex::new(capsules);

    match cli.command {
        Commands::Search {
            query,
            category,
            platform,
            tags,
            fuzzy,
            limit,
            json,
        } => {
            let tags_vec = tags
                .map(|t| t.split(',').map(|s| s.trim().to_string()).collect())
                .unwrap_or_default();

            let search_query = SearchQuery {
                query: query.clone(),
                category,
                platform,
                tags: tags_vec,
                limit,
                offset: 0,
            };

            let config = SearchConfig::default();

            let result = if fuzzy {
                hublab_engine::search::fuzzy_search_capsules(&index, &search_query, &config)
            } else {
                hublab_engine::search::search_capsules(&index, &search_query, &config)
            };

            if json {
                println!("{}", serde_json::to_string_pretty(&result)?);
            } else {
                println!(
                    "\n{} Found {} results in {}ms\n",
                    "🔍".bold(),
                    result.total.to_string().green().bold(),
                    result.took_ms.to_string().cyan()
                );

                for (idx, scored) in result.results.iter().enumerate() {
                    println!(
                        "{:2}. {} {}",
                        idx + 1,
                        scored.capsule.name.bold(),
                        format!("(score: {:.1})", scored.score).dimmed()
                    );
                    println!(
                        "    {} {} | {} {}",
                        "Category:".dimmed(),
                        scored.capsule.category.yellow(),
                        "Platform:".dimmed(),
                        scored.capsule.platform.blue()
                    );
                    println!(
                        "    {} {}",
                        "Tags:".dimmed(),
                        scored.capsule.tags.join(", ").green()
                    );
                    println!("    {}", scored.capsule.description.dimmed());
                    println!();
                }
            }
        }

        Commands::Get { id, json } => {
            if let Some(capsule) = index.get(&id) {
                if json {
                    println!("{}", serde_json::to_string_pretty(capsule)?);
                } else {
                    println!("\n{} {}\n", "📦".bold(), capsule.name.bold().cyan());
                    println!("{}", "─".repeat(50).dimmed());
                    println!("{} {}", "ID:".dimmed(), capsule.id);
                    println!("{} {}", "Category:".dimmed(), capsule.category.yellow());
                    println!("{} {}", "Platform:".dimmed(), capsule.platform.blue());
                    println!("{} {}", "Tags:".dimmed(), capsule.tags.join(", ").green());
                    println!("\n{}", "Description:".bold());
                    println!("{}\n", capsule.description);

                    if let Some(ref code) = capsule.code_snippet {
                        println!("{} {} lines", "Code:".bold(), code.lines().count());
                    }
                }
            } else {
                eprintln!("{} Capsule not found: {}", "❌".red(), id);
                std::process::exit(1);
            }
        }

        Commands::Categories => {
            let categories = index.categories();
            println!("\n{} Total Categories: {}\n", "📂".bold(), categories.len());

            for category in categories {
                let count = index.by_category_name(&category).len();
                println!("  {} {} capsules", category.yellow(), count.to_string().dimmed());
            }
        }

        Commands::Tags { limit } => {
            let tags = index.tags();
            println!("\n{} Total Tags: {}\n", "🏷️".bold(), tags.len());

            for tag in tags.iter().take(limit) {
                let count = index.by_tag_name(tag).len();
                println!("  {} {} capsules", tag.green(), count.to_string().dimmed());
            }

            if tags.len() > limit {
                println!("\n  {} {} more tags...", "...".dimmed(), (tags.len() - limit).to_string().dimmed());
            }
        }

        Commands::Stats => {
            let categories = index.categories();
            let tags = index.tags();

            println!("\n{} HubLab Engine Statistics\n", "📊".bold());
            println!("{}", "═".repeat(50).dimmed());
            println!("{:20} {}", "Total Capsules:".bold(), index.len().to_string().green());
            println!("{:20} {}", "Categories:".bold(), categories.len().to_string().yellow());
            println!("{:20} {}", "Tags:".bold(), tags.len().to_string().blue());
            println!("{}", "═".repeat(50).dimmed());

            // Calculate platform distribution
            let mut platform_counts = std::collections::HashMap::new();
            for capsule in &index.all {
                *platform_counts.entry(&capsule.platform).or_insert(0) += 1;
            }

            println!("\n{}", "Platform Distribution:".bold());
            for (platform, count) in platform_counts {
                println!("  {}: {} capsules", platform.cyan(), count.to_string().dimmed());
            }
        }
    }

    Ok(())
}
