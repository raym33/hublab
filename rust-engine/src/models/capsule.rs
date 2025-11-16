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
}

fn default_platform() -> String {
    "react".to_string()
}

impl Capsule {
    /// Check if capsule matches a search query
    pub fn matches(&self, query: &str) -> bool {
        let query_lower = query.to_lowercase();

        self.name.to_lowercase().contains(&query_lower)
            || self.description.to_lowercase().contains(&query_lower)
            || self.tags.iter().any(|tag| tag.to_lowercase().contains(&query_lower))
            || self.category.to_lowercase().contains(&query_lower)
    }

    /// Calculate relevance score for a query
    pub fn score(&self, query: &str) -> f64 {
        let query_lower = query.to_lowercase();
        let mut score = 0.0;

        // Exact match in name
        if self.name.to_lowercase() == query_lower {
            score += 100.0;
        } else if self.name.to_lowercase().contains(&query_lower) {
            score += 50.0;
        }

        // Match in description
        if self.description.to_lowercase().contains(&query_lower) {
            score += 30.0;
        }

        // Match in tags
        for tag in &self.tags {
            if tag.to_lowercase() == query_lower {
                score += 40.0;
            } else if tag.to_lowercase().contains(&query_lower) {
                score += 20.0;
            }
        }

        // Match in category
        if self.category.to_lowercase() == query_lower {
            score += 25.0;
        } else if self.category.to_lowercase().contains(&query_lower) {
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
        let capsule = Capsule {
            id: "test-1".to_string(),
            name: "Dashboard Analytics".to_string(),
            category: "UI".to_string(),
            description: "Analytics dashboard component".to_string(),
            tags: vec!["dashboard".to_string(), "analytics".to_string()],
            platform: "react".to_string(),
            code_snippet: None,
            metadata: None,
        };

        assert!(capsule.matches("dashboard"));
        assert!(capsule.matches("Analytics"));
        assert!(capsule.matches("UI"));
        assert!(!capsule.matches("nonexistent"));
    }

    #[test]
    fn test_capsule_score() {
        let capsule = Capsule {
            id: "test-1".to_string(),
            name: "Dashboard".to_string(),
            category: "UI".to_string(),
            description: "A dashboard component".to_string(),
            tags: vec!["dashboard".to_string()],
            platform: "react".to_string(),
            code_snippet: None,
            metadata: None,
        };

        let score_exact = capsule.score("Dashboard");
        let score_partial = capsule.score("dash");
        let score_tag = capsule.score("dashboard");

        assert!(score_exact > 100.0);
        assert!(score_partial > 0.0);
        assert!(score_tag > 0.0);
        assert!(score_exact > score_partial);
    }
}
