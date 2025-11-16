use hublab_engine::{load_capsules_from_json, CapsuleIndex, SearchConfig, SearchQuery};
use std::path::PathBuf;

/// Integration test: Load real data and perform searches
#[test]
fn test_load_real_data_and_search() {
    let data_path = PathBuf::from("../data/all-capsules.json");

    if !data_path.exists() {
        println!("Skipping test: data file not found");
        return;
    }

    let capsules = load_capsules_from_json(&data_path).expect("Failed to load capsules");

    assert!(!capsules.is_empty(), "Should load at least some capsules");
    assert!(
        capsules.len() > 1000,
        "Should load thousands of capsules, got {}",
        capsules.len()
    );

    // Test indexing
    let index = CapsuleIndex::new(capsules);

    assert!(index.len() > 1000);
    assert!(index.categories().len() > 10, "Should have many categories");

    // Test search performance
    let query = SearchQuery {
        query: "dashboard".to_string(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 20,
        offset: 0,
    };

    let config = SearchConfig::default();
    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert!(!result.results.is_empty(), "Should find dashboard results");

    // More lenient timeout for debug builds
    let timeout = if cfg!(debug_assertions) { 200 } else { 50 };
    assert!(
        result.took_ms < timeout,
        "Search should be reasonably fast, took {}ms (limit: {}ms)",
        result.took_ms,
        timeout
    );

    println!("✅ Found {} results in {}ms", result.total, result.took_ms);
}

#[test]
fn test_search_performance_multiple_queries() {
    let data_path = PathBuf::from("../data/all-capsules.json");

    if !data_path.exists() {
        println!("Skipping test: data file not found");
        return;
    }

    let capsules = load_capsules_from_json(&data_path).expect("Failed to load capsules");
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let queries = vec!["dashboard", "authentication", "button", "form", "analytics"];

    for query_str in queries {
        let query = SearchQuery {
            query: query_str.to_string(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = hublab_engine::search::search_capsules(&index, &query, &config);

        let timeout = if cfg!(debug_assertions) { 100 } else { 20 };
        assert!(
            result.took_ms < timeout,
            "Query '{}' should be reasonably fast, took {}ms (limit: {}ms)",
            query_str,
            result.took_ms,
            timeout
        );

        println!(
            "  Query '{}': {} results in {}ms",
            query_str, result.total, result.took_ms
        );
    }
}

#[test]
fn test_fuzzy_search_with_real_data() {
    let data_path = PathBuf::from("../data/all-capsules.json");

    if !data_path.exists() {
        println!("Skipping test: data file not found");
        return;
    }

    let capsules = load_capsules_from_json(&data_path).expect("Failed to load capsules");
    let index = CapsuleIndex::new(capsules);

    // Use lower threshold for more permissive fuzzy matching
    let config = SearchConfig {
        fuzzy_threshold: 0.7, // Lower threshold for typos with more differences
        ..Default::default()
    };

    // Test typos
    let typos = vec![
        ("dashbord", "dashboard"),
        ("autentication", "authentication"),
        ("buttom", "button"),
    ];

    for (typo, expected) in typos {
        let query = SearchQuery {
            query: typo.to_string(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 5,
            offset: 0,
        };

        let result = hublab_engine::search::fuzzy_search_capsules(&index, &query, &config);

        assert!(
            !result.results.is_empty(),
            "Fuzzy search should find results for typo '{}'",
            typo
        );

        let timeout = if cfg!(debug_assertions) { 500 } else { 100 };
        assert!(
            result.took_ms < timeout,
            "Fuzzy search for '{}' should be reasonably fast, took {}ms (limit: {}ms)",
            typo,
            result.took_ms,
            timeout
        );

        // Check if any result contains the expected term
        let has_expected = result.results.iter().any(|r| {
            r.capsule
                .name
                .to_lowercase()
                .contains(&expected.to_lowercase())
        });

        println!(
            "  Fuzzy '{}' → found {} results in {}ms (has '{}': {})",
            typo, result.total, result.took_ms, expected, has_expected
        );
    }
}

#[test]
fn test_category_filtering() {
    let data_path = PathBuf::from("../data/all-capsules.json");

    if !data_path.exists() {
        println!("Skipping test: data file not found");
        return;
    }

    let capsules = load_capsules_from_json(&data_path).expect("Failed to load capsules");
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    // Get a category from the index
    let categories = index.categories();
    assert!(!categories.is_empty(), "Should have categories");

    let test_category = &categories[0];

    let query = SearchQuery {
        query: String::new(),
        category: Some(test_category.clone()),
        platform: None,
        tags: vec![],
        limit: 100,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    // All results should be from the specified category
    for scored in &result.results {
        assert_eq!(
            &scored.capsule.category, test_category,
            "All results should be from category '{}'",
            test_category
        );
    }

    println!(
        "✅ Category filter '{}': {} results",
        test_category, result.total
    );
}

#[test]
fn test_pagination() {
    let data_path = PathBuf::from("../data/all-capsules.json");

    if !data_path.exists() {
        println!("Skipping test: data file not found");
        return;
    }

    let capsules = load_capsules_from_json(&data_path).expect("Failed to load capsules");
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query_base = SearchQuery {
        query: "component".to_string(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 0,
    };

    // Get first page
    let page1 = hublab_engine::search::search_capsules(&index, &query_base, &config);

    // Get second page
    let mut query_page2 = query_base.clone();
    query_page2.offset = 10;
    let page2 = hublab_engine::search::search_capsules(&index, &query_page2, &config);

    assert_eq!(
        page1.total, page2.total,
        "Total should be same for both pages"
    );

    if page1.results.len() == 10 && !page2.results.is_empty() {
        // Check that pages don't overlap
        let page1_ids: Vec<_> = page1.results.iter().map(|r| &r.capsule.id).collect();
        let page2_ids: Vec<_> = page2.results.iter().map(|r| &r.capsule.id).collect();

        for id in &page2_ids {
            assert!(
                !page1_ids.contains(id),
                "Page 2 should not contain IDs from page 1"
            );
        }
    }

    println!(
        "✅ Pagination: Page 1 ({} results) and Page 2 ({} results)",
        page1.results.len(),
        page2.results.len()
    );
}

#[test]
fn test_empty_query_returns_all() {
    let data_path = PathBuf::from("../data/all-capsules.json");

    if !data_path.exists() {
        println!("Skipping test: data file not found");
        return;
    }

    let capsules = load_capsules_from_json(&data_path).expect("Failed to load capsules");
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: String::new(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 20,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert_eq!(
        result.results.len(),
        20,
        "Should return limit number of results"
    );
    assert_eq!(result.total, index.len(), "Total should match index size");

    println!(
        "✅ Empty query: returned {} results, total {}",
        result.results.len(),
        result.total
    );
}
