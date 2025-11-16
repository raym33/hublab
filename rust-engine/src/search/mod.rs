use crate::index::CapsuleIndex;
use crate::models::Capsule;
use serde::{Deserialize, Serialize};

/// Search configuration
#[derive(Debug, Clone)]
pub struct SearchConfig {
    pub fuzzy_enabled: bool,
    pub fuzzy_threshold: f64,
    pub max_results: usize,
}

impl Default for SearchConfig {
    fn default() -> Self {
        Self {
            fuzzy_enabled: true,
            fuzzy_threshold: 0.8,
            max_results: 100,
        }
    }
}

/// Search query parameters
#[derive(Debug, Clone, Deserialize)]
pub struct SearchQuery {
    pub query: String,
    pub category: Option<String>,
    pub platform: Option<String>,
    pub tags: Vec<String>,
    #[serde(default = "default_limit")]
    pub limit: usize,
    #[serde(default)]
    pub offset: usize,
}

fn default_limit() -> usize {
    20
}

/// Scored capsule result
#[derive(Debug, Clone, Serialize)]
pub struct ScoredCapsule {
    #[serde(flatten)]
    pub capsule: Capsule,
    pub score: f64,
}

/// Search result
#[derive(Debug, Clone, Serialize)]
pub struct SearchResult {
    pub results: Vec<ScoredCapsule>,
    pub total: usize,
    pub took_ms: u64,
}

/// Search capsules in the index
pub fn search_capsules(
    index: &CapsuleIndex,
    query: &SearchQuery,
    config: &SearchConfig,
) -> SearchResult {
    let start = std::time::Instant::now();

    // Start with all capsules
    let mut candidates: Vec<_> = index.all.iter().collect();

    // Filter by category if specified
    if let Some(ref category) = query.category {
        candidates.retain(|c| c.category.eq_ignore_ascii_case(category));
    }

    // Filter by platform if specified
    if let Some(ref platform) = query.platform {
        candidates.retain(|c| c.platform.eq_ignore_ascii_case(platform));
    }

    // Filter by tags if specified
    if !query.tags.is_empty() {
        candidates.retain(|c| {
            query.tags.iter().all(|tag| {
                c.tags
                    .iter()
                    .any(|t| t.eq_ignore_ascii_case(tag))
            })
        });
    }

    // Score and filter by query (optimized with pre-lowercased query)
    let mut scored: Vec<_> = if query.query.is_empty() {
        // If no query, return all with base score
        candidates
            .into_iter()
            .map(|c| ScoredCapsule {
                capsule: c.clone(),
                score: 1.0,
            })
            .collect()
    } else {
        let query_lower = query.query.to_lowercase();
        candidates
            .into_iter()
            .filter_map(|c| {
                let score = c.score(&query_lower);
                if score > 0.0 {
                    Some(ScoredCapsule {
                        capsule: c.clone(),
                        score,
                    })
                } else {
                    None
                }
            })
            .collect()
    };

    // Sort by score descending
    scored.sort_by(|a, b| {
        b.score
            .partial_cmp(&a.score)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    let total = scored.len();

    // Apply pagination
    let results: Vec<_> = scored
        .into_iter()
        .skip(query.offset)
        .take(query.limit.min(config.max_results))
        .collect();

    let took_ms = start.elapsed().as_millis() as u64;

    SearchResult {
        results,
        total,
        took_ms,
    }
}

/// Fuzzy search using Jaro-Winkler similarity (optimized)
pub fn fuzzy_search_capsules(
    index: &CapsuleIndex,
    query: &SearchQuery,
    config: &SearchConfig,
) -> SearchResult {
    let start = std::time::Instant::now();
    let query_lower = query.query.to_lowercase();

    let mut scored: Vec<_> = index
        .all
        .iter()
        .filter_map(|capsule| {
            // Apply filters
            if let Some(ref category) = query.category {
                if !capsule.category.eq_ignore_ascii_case(category) {
                    return None;
                }
            }

            if let Some(ref platform) = query.platform {
                if !capsule.platform.eq_ignore_ascii_case(platform) {
                    return None;
                }
            }

            if !query.tags.is_empty() {
                let has_all_tags = query.tags.iter().all(|tag| {
                    capsule
                        .tags
                        .iter()
                        .any(|t| t.eq_ignore_ascii_case(tag))
                });
                if !has_all_tags {
                    return None;
                }
            }

            // Calculate fuzzy similarity using cached lowercase fields
            let name_similarity = strsim::jaro_winkler(&query_lower, &capsule.name);
            let desc_similarity = strsim::jaro_winkler(&query_lower, &capsule.description);

            let max_similarity = name_similarity.max(desc_similarity);

            if max_similarity >= config.fuzzy_threshold {
                let base_score = capsule.score(&query_lower);
                let score = (base_score * max_similarity).max(max_similarity * 100.0);

                Some(ScoredCapsule {
                    capsule: capsule.clone(),
                    score,
                })
            } else {
                None
            }
        })
        .collect();

    // Sort by score descending
    scored.sort_by(|a, b| {
        b.score
            .partial_cmp(&a.score)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    let total = scored.len();

    // Apply pagination
    let results: Vec<_> = scored
        .into_iter()
        .skip(query.offset)
        .take(query.limit.min(config.max_results))
        .collect();

    let took_ms = start.elapsed().as_millis() as u64;

    SearchResult {
        results,
        total,
        took_ms,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_capsule(id: &str, name: &str, category: &str, tags: Vec<&str>) -> Capsule {
        Capsule::new(
            id.to_string(),
            name.to_string(),
            category.to_string(),
            format!("Description for {}", name),
            tags.iter().map(|s| s.to_string()).collect(),
            "react".to_string(),
            None,
            None,
        )
    }

    #[test]
    fn test_search_basic() {
        let capsules = vec![
            create_test_capsule("1", "Dashboard", "UI", vec!["dashboard", "analytics"]),
            create_test_capsule("2", "Button", "UI", vec!["button", "component"]),
            create_test_capsule("3", "Data Table", "Data", vec!["table", "grid"]),
        ];

        let index = CapsuleIndex::new(capsules);
        let config = SearchConfig::default();

        let query = SearchQuery {
            query: "dashboard".to_string(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = search_capsules(&index, &query, &config);

        assert!(!result.results.is_empty());
        assert_eq!(result.results[0].capsule.name, "Dashboard");
    }

    #[test]
    fn test_search_with_category_filter() {
        let capsules = vec![
            create_test_capsule("1", "UI Component", "UI", vec![]),
            create_test_capsule("2", "Data Table", "Data", vec![]),
        ];

        let index = CapsuleIndex::new(capsules);
        let config = SearchConfig::default();

        let query = SearchQuery {
            query: String::new(),
            category: Some("UI".to_string()),
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = search_capsules(&index, &query, &config);

        assert_eq!(result.total, 1);
        assert_eq!(result.results[0].capsule.category, "UI");
    }

    #[test]
    fn test_fuzzy_search() {
        let capsules = vec![
            create_test_capsule("1", "Dashboard", "UI", vec![]),
        ];

        let index = CapsuleIndex::new(capsules);
        let mut config = SearchConfig::default();
        config.fuzzy_threshold = 0.7;

        let query = SearchQuery {
            query: "dashbord".to_string(), // typo
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = fuzzy_search_capsules(&index, &query, &config);

        assert!(!result.results.is_empty());
        assert_eq!(result.results[0].capsule.name, "Dashboard");
    }
}
