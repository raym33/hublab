use criterion::{black_box, criterion_group, criterion_main, BenchmarkId, Criterion};
use hublab_engine::{
    load_capsules_from_json, models::capsule::Capsule, CapsuleIndex, SearchConfig, SearchQuery,
};
use std::path::PathBuf;

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

            Capsule::new(
                format!("capsule-{}", i),
                format!("Test Capsule {}", i),
                category.to_string(),
                format!(
                    "This is a test capsule for benchmarking purposes. Number {}",
                    i
                ),
                vec![
                    format!("tag{}", i % 10),
                    format!("category{}", i % 5),
                    "test".to_string(),
                ],
                "react".to_string(),
                Some(format!("export default function Capsule{}() {{}}", i)),
                None,
            )
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
    let mut group = c.benchmark_group("index_creation");

    for size in [100, 1000, 5000, 8150].iter() {
        group.bench_with_input(BenchmarkId::from_parameter(size), size, |b, &size| {
            let capsules = create_test_capsules(size);
            b.iter(|| CapsuleIndex::new(black_box(capsules.clone())))
        });
    }

    group.finish();
}

fn real_data_benchmark(c: &mut Criterion) {
    let data_path = PathBuf::from("../data/all-capsules.json");

    // Only run if data file exists
    if !data_path.exists() {
        eprintln!("Skipping real data benchmarks: data file not found");
        return;
    }

    let mut group = c.benchmark_group("real_data");

    // Load real data once
    group.bench_function("load_real_data", |b| {
        b.iter(|| load_capsules_from_json(black_box(&data_path)).unwrap())
    });

    let capsules = load_capsules_from_json(&data_path).unwrap();
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    group.bench_function("search_real_data_common_term", |b| {
        b.iter(|| {
            let query = SearchQuery {
                query: black_box("button".to_string()),
                category: None,
                platform: None,
                tags: vec![],
                limit: 20,
                offset: 0,
            };
            hublab_engine::search::search_capsules(black_box(&index), &query, &config)
        })
    });

    group.bench_function("search_real_data_rare_term", |b| {
        b.iter(|| {
            let query = SearchQuery {
                query: black_box("authentication".to_string()),
                category: None,
                platform: None,
                tags: vec![],
                limit: 20,
                offset: 0,
            };
            hublab_engine::search::search_capsules(black_box(&index), &query, &config)
        })
    });

    group.bench_function("fuzzy_search_real_data", |b| {
        b.iter(|| {
            let query = SearchQuery {
                query: black_box("dashbord".to_string()), // typo
                category: None,
                platform: None,
                tags: vec![],
                limit: 20,
                offset: 0,
            };
            hublab_engine::search::fuzzy_search_capsules(black_box(&index), &query, &config)
        })
    });

    group.finish();
}

fn scalability_benchmark(c: &mut Criterion) {
    let mut group = c.benchmark_group("scalability");

    for size in [100, 500, 1000, 5000, 8150].iter() {
        let capsules = create_test_capsules(*size);
        let index = CapsuleIndex::new(capsules);
        let config = SearchConfig::default();

        group.bench_with_input(
            BenchmarkId::new("exact_search", size),
            size,
            |b, _size| {
                b.iter(|| {
                    let query = SearchQuery {
                        query: black_box("Test".to_string()),
                        category: None,
                        platform: None,
                        tags: vec![],
                        limit: 20,
                        offset: 0,
                    };
                    hublab_engine::search::search_capsules(black_box(&index), &query, &config)
                })
            },
        );
    }

    group.finish();
}

fn pagination_benchmark(c: &mut Criterion) {
    let capsules = create_test_capsules(8150);
    let index = CapsuleIndex::new(capsules);
    let config = SearchConfig::default();

    let mut group = c.benchmark_group("pagination");

    for offset in [0, 100, 500, 1000].iter() {
        group.bench_with_input(
            BenchmarkId::new("paginated_search", offset),
            offset,
            |b, &offset| {
                b.iter(|| {
                    let query = SearchQuery {
                        query: black_box("capsule".to_string()),
                        category: None,
                        platform: None,
                        tags: vec![],
                        limit: 20,
                        offset,
                    };
                    hublab_engine::search::search_capsules(black_box(&index), &query, &config)
                })
            },
        );
    }

    group.finish();
}

criterion_group!(
    benches,
    search_benchmark,
    index_creation_benchmark,
    real_data_benchmark,
    scalability_benchmark,
    pagination_benchmark
);
criterion_main!(benches);
