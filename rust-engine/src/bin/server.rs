use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use hublab_engine::{load_capsules_from_json, CapsuleIndex, SearchConfig, SearchQuery};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::CorsLayer;

#[derive(Clone)]
struct AppState {
    index: Arc<CapsuleIndex>,
    config: SearchConfig,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
    capsules_loaded: usize,
    categories: usize,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

#[derive(Deserialize)]
struct SearchParams {
    q: Option<String>,
    category: Option<String>,
    platform: Option<String>,
    tags: Option<String>,
    #[serde(default = "default_limit")]
    limit: usize,
    #[serde(default)]
    offset: usize,
}

fn default_limit() -> usize {
    20
}

async fn health_handler(State(state): State<AppState>) -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        capsules_loaded: state.index.len(),
        categories: state.index.categories().len(),
    })
}

async fn search_handler(
    State(state): State<AppState>,
    Query(params): Query<SearchParams>,
) -> Json<hublab_engine::search::SearchResult> {
    let tags = params
        .tags
        .map(|t| t.split(',').map(|s| s.trim().to_string()).collect())
        .unwrap_or_default();

    let query = SearchQuery {
        query: params.q.unwrap_or_default(),
        category: params.category,
        platform: params.platform,
        tags,
        limit: params.limit,
        offset: params.offset,
    };

    let result = hublab_engine::search::search_capsules(&state.index, &query, &state.config);

    Json(result)
}

async fn fuzzy_search_handler(
    State(state): State<AppState>,
    Query(params): Query<SearchParams>,
) -> Json<hublab_engine::search::SearchResult> {
    let tags = params
        .tags
        .map(|t| t.split(',').map(|s| s.trim().to_string()).collect())
        .unwrap_or_default();

    let query = SearchQuery {
        query: params.q.unwrap_or_default(),
        category: params.category,
        platform: params.platform,
        tags,
        limit: params.limit,
        offset: params.offset,
    };

    let result = hublab_engine::search::fuzzy_search_capsules(&state.index, &query, &state.config);

    Json(result)
}

async fn get_capsule_handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<hublab_engine::Capsule>, (StatusCode, Json<ErrorResponse>)> {
    if let Some(capsule) = state.index.get(&id) {
        Ok(Json(capsule.clone()))
    } else {
        Err((
            StatusCode::NOT_FOUND,
            Json(ErrorResponse {
                error: format!("Capsule not found: {}", id),
            }),
        ))
    }
}

#[derive(Serialize)]
struct CategoriesResponse {
    categories: Vec<CategoryInfo>,
}

#[derive(Serialize)]
struct CategoryInfo {
    name: String,
    count: usize,
}

async fn categories_handler(State(state): State<AppState>) -> Json<CategoriesResponse> {
    let categories: Vec<CategoryInfo> = state
        .index
        .categories()
        .into_iter()
        .map(|name| {
            let count = state.index.by_category_name(&name).len();
            CategoryInfo { name, count }
        })
        .collect();

    Json(CategoriesResponse { categories })
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    // Load capsules
    let data_path = std::env::var("DATA_PATH")
        .unwrap_or_else(|_| "../data/all-capsules.json".to_string());

    tracing::info!("Loading capsules from: {}", data_path);

    let capsules = load_capsules_from_json(&data_path)?;
    let index = Arc::new(CapsuleIndex::new(capsules));

    tracing::info!(
        "Loaded {} capsules across {} categories",
        index.len(),
        index.categories().len()
    );

    let config = SearchConfig::default();

    let state = AppState { index, config };

    // Build router
    let app = Router::new()
        .route("/healthz", get(health_handler))
        .route("/api/search", get(search_handler))
        .route("/api/search/fuzzy", get(fuzzy_search_handler))
        .route("/api/capsules/:id", get(get_capsule_handler))
        .route("/api/categories", get(categories_handler))
        .layer(CorsLayer::permissive())
        .with_state(state);

    // Get port from env or use default
    let port = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);

    let addr = format!("0.0.0.0:{}", port);

    tracing::info!("🚀 HubLab Rust Engine v{}", env!("CARGO_PKG_VERSION"));
    tracing::info!("🌐 Listening on http://{}", addr);
    tracing::info!("\nEndpoints:");
    tracing::info!("  GET  /healthz");
    tracing::info!("  GET  /api/search");
    tracing::info!("  GET  /api/search/fuzzy");
    tracing::info!("  GET  /api/capsules/:id");
    tracing::info!("  GET  /api/categories");

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
