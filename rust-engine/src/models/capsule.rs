use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Capsule metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CapsuleMetadata {
    pub version: Option<String>,
    pub author: Option<String>,
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Main Capsule structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Capsule {
    pub id: String,
    pub name: String,
    pub category: String,
    pub description: String,
    pub tags: Vec<String>,
    #[serde(default = "default_platform")]
    pub platform: String,
    pub code_snippet: Option<String>,
    pub metadata: Option<CapsuleMetadata>,

    // Cached lowercase versions for faster searching (not serialized)
    #[serde(skip)]
    name_lower: String,
    #[serde(skip)]
    description_lower: String,
    #[serde(skip)]
    tags_lower: Vec<String>,
    #[serde(skip)]
    category_lower: String,
}

fn default_platform() -> String {
    "react".to_string()
}

impl Capsule {
    /// Initialize cached lowercase fields after deserialization
    pub fn init_cache(&mut self) {
        self.name_lower = self.name.to_lowercase();
        self.description_lower = self.description.to_lowercase();
        self.tags_lower = self.tags.iter().map(|t| t.to_lowercase()).collect();
        self.category_lower = self.category.to_lowercase();
    }

    /// Create a new Capsule with cached fields initialized
    pub fn new(
        id: String,
        name: String,
        category: String,
        description: String,
        tags: Vec<String>,
        platform: String,
        code_snippet: Option<String>,
        metadata: Option<CapsuleMetadata>,
    ) -> Self {
        let name_lower = name.to_lowercase();
        let description_lower = description.to_lowercase();
        let tags_lower = tags.iter().map(|t| t.to_lowercase()).collect();
        let category_lower = category.to_lowercase();

        Self {
            id,
            name,
            category,
            description,
            tags,
            platform,
            code_snippet,
            metadata,
            name_lower,
            description_lower,
            tags_lower,
            category_lower,
        }
    }

    /// Check if capsule matches a search query (optimized)
    #[inline]
    pub fn matches(&self, query_lower: &str) -> bool {
        self.name_lower.contains(query_lower)
            || self.description_lower.contains(query_lower)
            || self.tags_lower.iter().any(|tag| tag.contains(query_lower))
            || self.category_lower.contains(query_lower)
    }

    /// Calculate relevance score for a query (optimized)
    #[inline]
    pub fn score(&self, query_lower: &str) -> f64 {
        let mut score = 0.0;

        // Exact match in name
        if self.name_lower == query_lower {
            score += 100.0;
        } else if self.name_lower.contains(query_lower) {
            score += 50.0;
        }

        // Match in description
        if self.description_lower.contains(query_lower) {
            score += 30.0;
        }

        // Match in tags
        for tag in &self.tags_lower {
            if tag == query_lower {
                score += 40.0;
            } else if tag.contains(query_lower) {
                score += 20.0;
            }
        }

        // Match in category
        if self.category_lower == query_lower {
            score += 25.0;
        } else if self.category_lower.contains(query_lower) {
            score += 10.0;
        }

        score
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_capsule_matches() {
        let capsule = Capsule::new(
            "test-1".to_string(),
            "Dashboard Analytics".to_string(),
            "UI".to_string(),
            "Analytics dashboard component".to_string(),
            vec!["dashboard".to_string(), "analytics".to_string()],
            "react".to_string(),
            None,
            None,
        );

        assert!(capsule.matches("dashboard"));
        assert!(capsule.matches("analytics"));
        assert!(capsule.matches("ui"));
        assert!(!capsule.matches("nonexistent"));
    }

    #[test]
    fn test_capsule_score() {
        let capsule = Capsule::new(
            "test-1".to_string(),
            "Dashboard".to_string(),
            "UI".to_string(),
            "A dashboard component".to_string(),
            vec!["dashboard".to_string()],
            "react".to_string(),
            None,
            None,
        );

        let score_exact = capsule.score("dashboard");
        let score_partial = capsule.score("dash");
        let score_tag = capsule.score("dashboard");

        assert!(score_exact > 100.0);
        assert!(score_partial > 0.0);
        assert!(score_tag > 0.0);
        assert!(score_exact > score_partial);
    }
}
