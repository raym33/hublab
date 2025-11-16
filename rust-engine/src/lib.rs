pub mod models;
pub mod index;
pub mod search;
pub mod loader;

pub use models::capsule::Capsule;
pub use index::CapsuleIndex;
pub use search::{SearchQuery, SearchResult, SearchConfig};
pub use loader::load_capsules_from_json;
