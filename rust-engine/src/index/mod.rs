use crate::models::Capsule;
use std::collections::HashMap;

/// In-memory index for fast capsule lookups
pub struct CapsuleIndex {
    pub all: Vec<Capsule>,
    pub by_id: HashMap<String, usize>,
    pub by_category: HashMap<String, Vec<usize>>,
    pub by_tag: HashMap<String, Vec<usize>>,
}

impl CapsuleIndex {
    /// Create a new index from a vector of capsules
    pub fn new(capsules: Vec<Capsule>) -> Self {
        let mut by_id = HashMap::new();
        let mut by_category: HashMap<String, Vec<usize>> = HashMap::new();
        let mut by_tag: HashMap<String, Vec<usize>> = HashMap::new();

        for (idx, capsule) in capsules.iter().enumerate() {
            // Index by ID
            by_id.insert(capsule.id.clone(), idx);

            // Index by category
            by_category
                .entry(capsule.category.clone())
                .or_default()
                .push(idx);

            // Index by tags
            for tag in &capsule.tags {
                by_tag.entry(tag.clone()).or_default().push(idx);
            }
        }

        Self {
            all: capsules,
            by_id,
            by_category,
            by_tag,
        }
    }

    /// Get a capsule by ID
    pub fn get(&self, id: &str) -> Option<&Capsule> {
        self.by_id.get(id).and_then(|&idx| self.all.get(idx))
    }

    /// Get capsules by category
    pub fn by_category_name(&self, category: &str) -> Vec<&Capsule> {
        self.by_category
            .get(category)
            .map(|indices| {
                indices
                    .iter()
                    .filter_map(|&idx| self.all.get(idx))
                    .collect()
            })
            .unwrap_or_default()
    }

    /// Get capsules by tag
    pub fn by_tag_name(&self, tag: &str) -> Vec<&Capsule> {
        self.by_tag
            .get(tag)
            .map(|indices| {
                indices
                    .iter()
                    .filter_map(|&idx| self.all.get(idx))
                    .collect()
            })
            .unwrap_or_default()
    }

    /// Get all unique categories
    pub fn categories(&self) -> Vec<String> {
        let mut categories: Vec<_> = self.by_category.keys().cloned().collect();
        categories.sort();
        categories
    }

    /// Get all unique tags
    pub fn tags(&self) -> Vec<String> {
        let mut tags: Vec<_> = self.by_tag.keys().cloned().collect();
        tags.sort();
        tags
    }

    /// Get total number of capsules
    pub fn len(&self) -> usize {
        self.all.len()
    }

    /// Check if index is empty
    pub fn is_empty(&self) -> bool {
        self.all.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_capsule(id: &str, category: &str, tags: Vec<&str>) -> Capsule {
        Capsule::new(
            id.to_string(),
            format!("Test {}", id),
            category.to_string(),
            "Test capsule".to_string(),
            tags.iter().map(|s| s.to_string()).collect(),
            "react".to_string(),
            None,
            None,
        )
    }

    #[test]
    fn test_index_creation() {
        let capsules = vec![
            create_test_capsule("1", "UI", vec!["button", "component"]),
            create_test_capsule("2", "UI", vec!["input", "form"]),
            create_test_capsule("3", "Data", vec!["table", "grid"]),
        ];

        let index = CapsuleIndex::new(capsules);

        assert_eq!(index.len(), 3);
        assert_eq!(index.categories().len(), 2);
        assert!(index.categories().contains(&"UI".to_string()));
        assert!(index.categories().contains(&"Data".to_string()));
    }

    #[test]
    fn test_get_by_id() {
        let capsules = vec![create_test_capsule("test-1", "UI", vec!["button"])];
        let index = CapsuleIndex::new(capsules);

        let capsule = index.get("test-1");
        assert!(capsule.is_some());
        assert_eq!(capsule.unwrap().id, "test-1");

        let missing = index.get("nonexistent");
        assert!(missing.is_none());
    }

    #[test]
    fn test_by_category() {
        let capsules = vec![
            create_test_capsule("1", "UI", vec![]),
            create_test_capsule("2", "UI", vec![]),
            create_test_capsule("3", "Data", vec![]),
        ];
        let index = CapsuleIndex::new(capsules);

        let ui_capsules = index.by_category_name("UI");
        assert_eq!(ui_capsules.len(), 2);

        let data_capsules = index.by_category_name("Data");
        assert_eq!(data_capsules.len(), 1);
    }
}
