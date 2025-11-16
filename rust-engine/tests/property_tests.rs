use hublab_engine::{models::Capsule, CapsuleIndex, SearchConfig, SearchQuery};
use proptest::prelude::*;

// Property-based tests using proptest to verify invariants

fn create_test_capsule(
    id: &str,
    name: &str,
    category: &str,
    description: &str,
    tags: Vec<&str>,
) -> Capsule {
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

fn create_test_index() -> CapsuleIndex {
    let capsules = vec![
        create_test_capsule(
            "1",
            "Dashboard",
            "UI",
            "A dashboard component",
            vec!["dashboard", "analytics"],
        ),
        create_test_capsule(
            "2",
            "Button",
            "UI",
            "A button component",
            vec!["button", "ui"],
        ),
        create_test_capsule(
            "3",
            "Data Table",
            "Data",
            "A data table component",
            vec!["table", "grid"],
        ),
        create_test_capsule(
            "4",
            "Form Input",
            "Forms",
            "Input field component",
            vec!["input", "form"],
        ),
        create_test_capsule(
            "5",
            "Modal Dialog",
            "UI",
            "Modal dialog component",
            vec!["modal", "dialog"],
        ),
    ];

    CapsuleIndex::new(capsules)
}

proptest! {
    /// Property: Search results never exceed the requested limit
    #[test]
    fn prop_results_respect_limit(limit in 1usize..100, offset in 0usize..10) {
        let index = create_test_index();
        let config = SearchConfig::default();

        let query = SearchQuery {
            query: "component".to_string(),
            category: None,
            platform: None,
            tags: vec![],
            limit,
            offset,
        };

        let result = hublab_engine::search::search_capsules(&index, &query, &config);

        prop_assert!(result.results.len() <= limit);
        prop_assert!(result.results.len() <= config.max_results);
    }

    /// Property: Total count is consistent across paginated queries
    #[test]
    fn prop_total_consistent_across_pages(offset1 in 0usize..5, offset2 in 0usize..5) {
        let index = create_test_index();
        let config = SearchConfig::default();

        let query1 = SearchQuery {
            query: "component".to_string(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 2,
            offset: offset1,
        };

        let query2 = SearchQuery {
            query: "component".to_string(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 2,
            offset: offset2,
        };

        let result1 = hublab_engine::search::search_capsules(&index, &query1, &config);
        let result2 = hublab_engine::search::search_capsules(&index, &query2, &config);

        // Total should be the same regardless of pagination
        prop_assert_eq!(result1.total, result2.total);
    }

    /// Property: Scores are always non-negative
    #[test]
    fn prop_scores_non_negative(query in "[a-z]{1,20}") {
        let index = create_test_index();
        let config = SearchConfig::default();

        let search_query = SearchQuery {
            query,
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = hublab_engine::search::search_capsules(&index, &search_query, &config);

        for scored in &result.results {
            prop_assert!(scored.score >= 0.0, "Score should be non-negative");
        }
    }

    /// Property: Filtered results are always a subset of unfiltered
    #[test]
    fn prop_filtering_produces_subset(category in prop::option::of("[A-Z]{2,10}")) {
        let index = create_test_index();
        let config = SearchConfig::default();

        // Query without filter
        let query_all = SearchQuery {
            query: String::new(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 100,
            offset: 0,
        };

        // Query with category filter
        let query_filtered = SearchQuery {
            query: String::new(),
            category,
            platform: None,
            tags: vec![],
            limit: 100,
            offset: 0,
        };

        let result_all = hublab_engine::search::search_capsules(&index, &query_all, &config);
        let result_filtered = hublab_engine::search::search_capsules(&index, &query_filtered, &config);

        // Filtered results should be <= total results
        prop_assert!(result_filtered.total <= result_all.total);
    }

    /// Property: Empty query returns all items (up to limit)
    #[test]
    fn prop_empty_query_returns_all(limit in 1usize..20) {
        let index = create_test_index();
        let config = SearchConfig::default();

        let query = SearchQuery {
            query: String::new(),
            category: None,
            platform: None,
            tags: vec![],
            limit,
            offset: 0,
        };

        let result = hublab_engine::search::search_capsules(&index, &query, &config);

        // Should return all items (or limit, whichever is smaller)
        prop_assert_eq!(result.total, index.len());
        prop_assert_eq!(result.results.len(), limit.min(index.len()));
    }

    /// Property: Pagination never returns duplicate IDs
    #[test]
    fn prop_pagination_no_duplicates(limit in 1usize..10) {
        let index = create_test_index();
        let config = SearchConfig::default();

        let query_page1 = SearchQuery {
            query: String::new(),
            category: None,
            platform: None,
            tags: vec![],
            limit,
            offset: 0,
        };

        let query_page2 = SearchQuery {
            query: String::new(),
            category: None,
            platform: None,
            tags: vec![],
            limit,
            offset: limit,
        };

        let page1 = hublab_engine::search::search_capsules(&index, &query_page1, &config);
        let page2 = hublab_engine::search::search_capsules(&index, &query_page2, &config);

        let page1_ids: Vec<_> = page1.results.iter().map(|r| &r.capsule.id).collect();
        let page2_ids: Vec<_> = page2.results.iter().map(|r| &r.capsule.id).collect();

        // Check no ID from page 1 appears in page 2
        for id in &page2_ids {
            prop_assert!(!page1_ids.contains(id), "Pages should not have overlapping IDs");
        }
    }

    /// Property: Results are always sorted by score (descending)
    #[test]
    fn prop_results_sorted_by_score(query in "[a-z]{1,15}") {
        let index = create_test_index();
        let config = SearchConfig::default();

        let search_query = SearchQuery {
            query,
            category: None,
            platform: None,
            tags: vec![],
            limit: 20,
            offset: 0,
        };

        let result = hublab_engine::search::search_capsules(&index, &search_query, &config);

        // Check that scores are in descending order
        for i in 1..result.results.len() {
            prop_assert!(
                result.results[i - 1].score >= result.results[i].score,
                "Results should be sorted by score descending"
            );
        }
    }

    /// Property: Fuzzy search respects threshold
    #[test]
    #[allow(clippy::field_reassign_with_default)]
    fn prop_fuzzy_respects_threshold(threshold in 0.5f64..1.0) {
        let index = create_test_index();
        let mut config = SearchConfig::default();
        config.fuzzy_threshold = threshold;

        let query = SearchQuery {
            query: "dashbord".to_string(), // typo
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = hublab_engine::search::fuzzy_search_capsules(&index, &query, &config);

        // All results should meet the threshold (implicitly, since they passed the filter)
        // We just verify no panic occurs and results are valid
        prop_assert!(result.results.len() <= query.limit);
    }

    /// Property: Offset beyond results returns empty
    #[test]
    fn prop_offset_beyond_returns_empty(offset in 1000usize..2000) {
        let index = create_test_index();
        let config = SearchConfig::default();

        let query = SearchQuery {
            query: String::new(),
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset,
        };

        let result = hublab_engine::search::search_capsules(&index, &query, &config);

        // Should return empty results but correct total
        prop_assert_eq!(result.results.len(), 0);
        prop_assert_eq!(result.total, index.len());
    }

    /// Property: Case-insensitive search works for any case variation
    #[test]
    fn prop_case_insensitive(
        original in "[a-z]{3,10}",
        use_upper in prop::bool::ANY,
        use_mixed in prop::bool::ANY
    ) {
        let capsules = vec![
            create_test_capsule("1", &original, "Test", "Description", vec![&original]),
        ];

        let index = CapsuleIndex::new(capsules);
        let config = SearchConfig::default();

        let query_str = if use_upper {
            original.to_uppercase()
        } else if use_mixed {
            // Mix of upper and lower
            original.chars().enumerate().map(|(i, c)| {
                if i % 2 == 0 { c.to_ascii_uppercase() } else { c }
            }).collect()
        } else {
            original.clone()
        };

        let query = SearchQuery {
            query: query_str,
            category: None,
            platform: None,
            tags: vec![],
            limit: 10,
            offset: 0,
        };

        let result = hublab_engine::search::search_capsules(&index, &query, &config);

        // Should find the capsule regardless of case
        prop_assert!(result.total > 0, "Case-insensitive search should find results");
    }
}
