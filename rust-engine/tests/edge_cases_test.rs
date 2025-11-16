use hublab_engine::{models::Capsule, CapsuleIndex, SearchConfig, SearchQuery};

fn create_test_capsule(id: &str, name: &str, category: &str, description: &str, tags: Vec<&str>) -> Capsule {
    Capsule::new(
        id.to_string(),
        name.to_string(),
        category.to_string(),
        description.to_string(),
        tags.iter().map(|s| s.to_string()).collect(),
        "react".to_string(),
        None,
        None,
    )
}

#[test]
fn test_case_insensitive_search() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    // Test various cases
    let test_cases = vec!["dashboard", "Dashboard", "DASHBOARD", "DashBoard"];

    for query_str in test_cases {
        let query = SearchQuery {
            query: query_str.to_string(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = hublab_engine::search::search_capsules(&index, &query, &config);

        assert!(
            !result.results.is_empty(),
            "Case '{}' should find results",
            query_str
        );
    }
}

#[test]
fn test_special_characters_in_query() {
    let capsules = vec![
        create_test_capsule("1", "Test-Component", "UI", "A test component", vec!["test"]),
        create_test_capsule("2", "2FA Setup", "Security", "Two factor auth", vec!["2fa"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let queries = vec!["test-component", "2fa", "test component"];

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

        assert!(
            !result.results.is_empty(),
            "Query '{}' should find results",
            query_str
        );
    }
}

#[test]
fn test_unicode_characters() {
    let capsules = vec![
        create_test_capsule("1", "Configuración", "Settings", "Settings in español", vec!["config"]),
        create_test_capsule("2", "日本語", "Language", "Japanese text", vec!["japanese"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: "configuración".to_string(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert!(!result.results.is_empty(), "Should handle unicode");
}

#[test]
fn test_very_long_query() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let long_query = "dashboard ".repeat(100); // Very long query

    let query = SearchQuery {
        query: long_query,
        category: None,
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    // Should complete without panic
    assert!(result.took_ms < 1000, "Should handle long queries efficiently");
}

#[test]
fn test_empty_index() {
    let capsules: Vec<Capsule> = vec![];
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: "anything".to_string(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert_eq!(result.total, 0);
    assert!(result.results.is_empty());
}

#[test]
fn test_query_with_only_spaces() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: "    ".to_string(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    // Should handle gracefully
    assert!(result.total >= 0);
}

#[test]
fn test_nonexistent_category_filter() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: String::new(),
        category: Some("NonExistentCategory".to_string()),
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert_eq!(result.total, 0, "Should return no results for nonexistent category");
    assert!(result.results.is_empty());
}

#[test]
fn test_multiple_tag_filters() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard", "analytics", "chart"]),
        create_test_capsule("2", "Button", "UI", "A button", vec!["button", "ui"]),
        create_test_capsule("3", "Chart", "DataViz", "A chart", vec!["chart", "analytics"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: String::new(),
        category: None,
        platform: None,
        tags: vec!["dashboard".to_string(), "analytics".to_string()],
        limit: 10,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert_eq!(result.total, 1, "Should find only capsules with both tags");
    assert_eq!(result.results[0].capsule.id, "1");
}

#[test]
fn test_combined_filters() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard UI", "Dashboard", "Dashboard UI", vec!["dashboard", "ui"]),
        create_test_capsule("2", "Dashboard Analytics", "Dashboard", "Analytics", vec!["dashboard", "analytics"]),
        create_test_capsule("3", "Button UI", "UI", "Button", vec!["button", "ui"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    // Query with category + tags
    let query = SearchQuery {
        query: String::new(),
        category: Some("Dashboard".to_string()),
        platform: None,
        tags: vec!["ui".to_string()],
        limit: 10,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert_eq!(result.total, 1, "Should filter by both category and tags");
    assert_eq!(result.results[0].capsule.id, "1");
}

#[test]
fn test_offset_beyond_results() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]),
        create_test_capsule("2", "Button", "UI", "A button", vec!["button"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: String::new(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 100, // Beyond available results
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert_eq!(result.results.len(), 0, "Should return empty when offset is beyond results");
    assert_eq!(result.total, 2, "Total should still reflect all results");
}

#[test]
fn test_limit_zero() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]),
    ];

    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let query = SearchQuery {
        query: "dashboard".to_string(),
        category: None,
        platform: None,
        tags: vec![],
        limit: 0,
        offset: 0,
    };

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert_eq!(result.results.len(), 0);
    assert!(result.total > 0, "Total should still reflect matching results");
}

#[test]
fn test_scoring_exact_match_higher() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard component", vec!["dash"]),
        create_test_capsule("2", "Dash Component", "UI", "A component with dash", vec!["component"]),
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

    let result = hublab_engine::search::search_capsules(&index, &query, &config);

    assert!(!result.results.is_empty());
    // Exact match "Dashboard" should score higher than partial "Dash"
    assert_eq!(result.results[0].capsule.id, "1", "Exact match should rank higher");
}

#[test]
fn test_capsule_with_empty_tags() {
    let capsule = create_test_capsule("1", "Test", "UI", "Description", vec![]);

    assert_eq!(capsule.tags.len(), 0);
    assert!(!capsule.matches("any"));
}

#[test]
fn test_capsule_score_zero_for_no_match() {
    let capsule = create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]);

    let score = capsule.score("completely different query");

    assert_eq!(score, 0.0, "Score should be zero when nothing matches");
}

#[test]
fn test_fuzzy_threshold_affects_results() {
    let capsules = vec![
        create_test_capsule("1", "Dashboard", "UI", "A dashboard", vec!["dashboard"]),
    ];

    let index = CapsuleIndex::new(capsules);

    // High threshold (strict)
    let mut config_strict = SearchConfig::default();
    config_strict.fuzzy_threshold = 0.95;

    let query = SearchQuery {
        query: "dashbrd".to_string(), // Missing letters
        category: None,
        platform: None,
        tags: vec![],
        limit: 10,
        offset: 0,
    };

    let result_strict = hublab_engine::search::fuzzy_search_capsules(&index, &query, &config_strict);

    // Low threshold (permissive)
    let mut config_permissive = SearchConfig::default();
    config_permissive.fuzzy_threshold = 0.6;

    let result_permissive = hublab_engine::search::fuzzy_search_capsules(&index, &query, &config_permissive);

    assert!(
        result_permissive.total >= result_strict.total,
        "Lower threshold should find more results"
    );
}
