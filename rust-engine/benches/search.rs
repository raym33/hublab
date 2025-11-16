use criterion::{black_box, criterion_group, criterion_main, Criterion};
use hublab_engine::{
    models::capsule::Capsule, CapsuleIndex, SearchConfig, SearchQuery,
};

fn create_test_capsules(count: usize) -> Vec<Capsule> {
    (0..count)
        .map(|i| {
            let category = match i % 5 {
                0 => "UI",
                1 => "Data",
                2 => "Forms",
                3 => "Auth",
                _ => "Other",
            };

            Capsule {
                id: format!("capsule-{}", i),
                name: format!("Test Capsule {}", i),
                category: category.to_string(),
                description: format!(
                    "This is a test capsule for benchmarking purposes. Number {}",
                    i
                ),
                tags: vec![
                    format!("tag{}", i % 10),
                    format!("category{}", i % 5),
                    "test".to_string(),
                ],
                platform: "react".to_string(),
                code_snippet: Some(format!("export default function Capsule{}() {{}}", i)),
                metadata: None,
            }
        })
        .collect()
}

fn search_benchmark(c: &mut Criterion) {
    let capsules = create_test_capsules(8150);
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    c.bench_function("search_8150_exact", |b| {
        b.iter(|| {
            let query = SearchQuery {
                query: black_box("Test Capsule".to_string()),
                category: None,
                platform: None,
                tags: vec![],
                limit: 20,
                offset: 0,
            };
            hublab_engine::search::search_capsules(black_box(&index), &query, &config)
        })
    });

    c.bench_function("search_8150_fuzzy", |b| {
        b.iter(|| {
            let query = SearchQuery {
                query: black_box("Tst Capsul".to_string()), // typos
                category: None,
                platform: None,
                tags: vec![],
                limit: 20,
                offset: 0,
            };
            hublab_engine::search::fuzzy_search_capsules(black_box(&index), &query, &config)
        })
    });

    c.bench_function("search_with_category_filter", |b| {
        b.iter(|| {
            let query = SearchQuery {
                query: black_box("capsule".to_string()),
                category: Some(black_box("UI".to_string())),
                platform: None,
                tags: vec![],
                limit: 20,
                offset: 0,
            };
            hublab_engine::search::search_capsules(black_box(&index), &query, &config)
        })
    });

    c.bench_function("search_with_tags_filter", |b| {
        b.iter(|| {
            let query = SearchQuery {
                query: black_box("capsule".to_string()),
                category: None,
                platform: None,
                tags: vec![black_box("test".to_string())],
                limit: 20,
                offset: 0,
            };
            hublab_engine::search::search_capsules(black_box(&index), &query, &config)
        })
    });
}

fn index_creation_benchmark(c: &mut Criterion) {
    c.bench_function("index_creation_8150", |b| {
        let capsules = create_test_capsules(8150);
        b.iter(|| {
            CapsuleIndex::new(black_box(capsules.clone()))
        })
    });
}

criterion_group!(benches, search_benchmark, index_creation_benchmark);
criterion_main!(benches);
