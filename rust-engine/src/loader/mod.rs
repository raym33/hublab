use crate::models::Capsule;
use anyhow::{Context, Result};
use serde::Deserialize;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Debug, Deserialize)]
struct ExportMetadata {
    total_capsules: usize,
    categories: Vec<String>,
    category_counts: HashMap<String, usize>,
    #[allow(dead_code)]
    export_date: String,
}

#[derive(Debug, Deserialize)]
struct ExportData {
    metadata: ExportMetadata,
    capsules: Vec<Capsule>,
}

/// Load capsules from a JSON file
pub fn load_capsules_from_json<P: AsRef<Path>>(path: P) -> Result<Vec<Capsule>> {
    let path = path.as_ref();

    let content = fs::read_to_string(path)
        .with_context(|| format!("Failed to read file: {}", path.display()))?;

    let mut export_data: ExportData = serde_json::from_str(&content)
        .with_context(|| format!("Failed to parse JSON from: {}", path.display()))?;

    tracing::info!(
        "Loaded {} capsules from {}",
        export_data.metadata.total_capsules,
        path.display()
    );

    tracing::info!(
        "Categories: {} unique categories",
        export_data.metadata.categories.len()
    );

    // Log top categories
    let mut category_counts: Vec<_> = export_data.metadata.category_counts.iter().collect();
    category_counts.sort_by(|a, b| b.1.cmp(a.1));

    tracing::debug!("Top 10 categories:");
    for (category, count) in category_counts.iter().take(10) {
        tracing::debug!("  {}: {} capsules", category, count);
    }

    // Initialize cache for all capsules
    for capsule in &mut export_data.capsules {
        capsule.init_cache();
    }

    Ok(export_data.capsules)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_load_capsules() {
        // Create a temporary JSON file
        let mut temp_file = NamedTempFile::new().unwrap();

        let json_data = r#"{
            "metadata": {
                "total_capsules": 2,
                "categories": ["UI", "Data"],
                "category_counts": {
                    "UI": 1,
                    "Data": 1
                },
                "export_date": "2025-01-01T00:00:00Z"
            },
            "capsules": [
                {
                    "id": "test-1",
                    "name": "Test Capsule 1",
                    "category": "UI",
                    "description": "A test capsule",
                    "tags": ["test"],
                    "platform": "react"
                },
                {
                    "id": "test-2",
                    "name": "Test Capsule 2",
                    "category": "Data",
                    "description": "Another test capsule",
                    "tags": ["test", "data"],
                    "platform": "react"
                }
            ]
        }"#;

        temp_file.write_all(json_data.as_bytes()).unwrap();
        temp_file.flush().unwrap();

        let capsules = load_capsules_from_json(temp_file.path()).unwrap();

        assert_eq!(capsules.len(), 2);
        assert_eq!(capsules[0].id, "test-1");
        assert_eq!(capsules[1].id, "test-2");
    }
}
