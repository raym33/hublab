/**
 * Database Capsules - 50 capsules
 * Database management and query components
 */

import { Capsule } from '@/types/capsule'

const databaseCapsules: Capsule[] = Array.from({ length: 50 }, (_, i) => {
  const capsules = [
    { id: 'db-postgres', name: 'PostgreSQL Client', desc: 'Connect and query PostgreSQL databases', tags: ['database', 'postgres', 'sql'] },
    { id: 'db-mysql', name: 'MySQL Client', desc: 'MySQL database connector with query builder', tags: ['database', 'mysql', 'sql'] },
    { id: 'db-mongodb', name: 'MongoDB Client', desc: 'NoSQL MongoDB operations and aggregations', tags: ['database', 'mongodb', 'nosql'] },
    { id: 'db-redis', name: 'Redis Cache', desc: 'In-memory data store for caching and pub/sub', tags: ['database', 'redis', 'cache'] },
    { id: 'db-elasticsearch', name: 'Elasticsearch', desc: 'Full-text search and analytics engine', tags: ['database', 'search', 'elasticsearch'] },
    { id: 'db-cassandra', name: 'Cassandra', desc: 'Distributed NoSQL database for high availability', tags: ['database', 'cassandra', 'nosql'] },
    { id: 'db-dynamodb', name: 'DynamoDB', desc: 'AWS DynamoDB key-value and document database', tags: ['database', 'dynamodb', 'aws'] },
    { id: 'db-couchdb', name: 'CouchDB', desc: 'Document-oriented NoSQL database', tags: ['database', 'couchdb', 'nosql'] },
    { id: 'db-neo4j', name: 'Neo4j Graph DB', desc: 'Graph database for connected data', tags: ['database', 'graph', 'neo4j'] },
    { id: 'db-influxdb', name: 'InfluxDB', desc: 'Time series database for metrics and events', tags: ['database', 'timeseries', 'influxdb'] },
    { id: 'db-query-builder', name: 'SQL Query Builder', desc: 'Visual SQL query builder with syntax highlighting', tags: ['database', 'sql', 'query'] },
    { id: 'db-migration', name: 'Database Migration', desc: 'Manage database schema migrations and versions', tags: ['database', 'migration', 'schema'] },
    { id: 'db-backup', name: 'Database Backup', desc: 'Automated backup and restore operations', tags: ['database', 'backup', 'recovery'] },
    { id: 'db-replication', name: 'DB Replication', desc: 'Configure and monitor database replication', tags: ['database', 'replication', 'ha'] },
    { id: 'db-sharding', name: 'Database Sharding', desc: 'Horizontal partitioning and sharding strategies', tags: ['database', 'sharding', 'scaling'] },
    { id: 'db-connection-pool', name: 'Connection Pool', desc: 'Manage database connection pooling', tags: ['database', 'pool', 'connections'] },
    { id: 'db-orm', name: 'ORM Builder', desc: 'Object-Relational Mapping with TypeORM/Prisma', tags: ['database', 'orm', 'mapping'] },
    { id: 'db-index-optimizer', name: 'Index Optimizer', desc: 'Analyze and optimize database indexes', tags: ['database', 'index', 'optimization'] },
    { id: 'db-performance', name: 'DB Performance Monitor', desc: 'Monitor query performance and slow queries', tags: ['database', 'performance', 'monitoring'] },
    { id: 'db-transaction', name: 'Transaction Manager', desc: 'ACID transaction management and rollback', tags: ['database', 'transaction', 'acid'] },
    { id: 'db-stored-procedure', name: 'Stored Procedures', desc: 'Create and execute stored procedures', tags: ['database', 'procedure', 'sql'] },
    { id: 'db-trigger', name: 'Database Triggers', desc: 'Define and manage database triggers', tags: ['database', 'trigger', 'automation'] },
    { id: 'db-view', name: 'Database Views', desc: 'Create and manage database views', tags: ['database', 'view', 'sql'] },
    { id: 'db-materialized-view', name: 'Materialized Views', desc: 'Precomputed query results for performance', tags: ['database', 'view', 'cache'] },
    { id: 'db-partitioning', name: 'Table Partitioning', desc: 'Partition large tables for better performance', tags: ['database', 'partition', 'optimization'] },
    { id: 'db-compression', name: 'Data Compression', desc: 'Compress database data to save storage', tags: ['database', 'compression', 'storage'] },
    { id: 'db-encryption', name: 'DB Encryption', desc: 'Encrypt sensitive data at rest and in transit', tags: ['database', 'encryption', 'security'] },
    { id: 'db-audit-log', name: 'Audit Logging', desc: 'Track all database changes and access', tags: ['database', 'audit', 'logging'] },
    { id: 'db-access-control', name: 'Access Control', desc: 'Manage database users, roles and permissions', tags: ['database', 'access', 'security'] },
    { id: 'db-data-masking', name: 'Data Masking', desc: 'Mask sensitive data for testing and development', tags: ['database', 'masking', 'privacy'] },
    { id: 'db-etl', name: 'ETL Pipeline', desc: 'Extract, Transform, Load data between databases', tags: ['database', 'etl', 'pipeline'] },
    { id: 'db-cdc', name: 'Change Data Capture', desc: 'Track and stream database changes in real-time', tags: ['database', 'cdc', 'streaming'] },
    { id: 'db-data-sync', name: 'Data Synchronization', desc: 'Sync data between multiple databases', tags: ['database', 'sync', 'replication'] },
    { id: 'db-versioning', name: 'Data Versioning', desc: 'Track historical versions of database records', tags: ['database', 'versioning', 'history'] },
    { id: 'db-archiving', name: 'Data Archiving', desc: 'Archive old data to cold storage', tags: ['database', 'archive', 'storage'] },
    { id: 'db-purging', name: 'Data Purging', desc: 'Automated data retention and purging policies', tags: ['database', 'purge', 'retention'] },
    { id: 'db-validation', name: 'Data Validation', desc: 'Validate data integrity and constraints', tags: ['database', 'validation', 'integrity'] },
    { id: 'db-deduplication', name: 'Data Deduplication', desc: 'Find and remove duplicate records', tags: ['database', 'dedup', 'cleanup'] },
    { id: 'db-profiling', name: 'Data Profiling', desc: 'Analyze data quality and statistics', tags: ['database', 'profiling', 'quality'] },
    { id: 'db-schema-compare', name: 'Schema Compare', desc: 'Compare schemas between databases', tags: ['database', 'schema', 'diff'] },
    { id: 'db-data-dictionary', name: 'Data Dictionary', desc: 'Document database schema and metadata', tags: ['database', 'documentation', 'schema'] },
    { id: 'db-lineage', name: 'Data Lineage', desc: 'Track data flow and transformations', tags: ['database', 'lineage', 'tracking'] },
    { id: 'db-catalog', name: 'Data Catalog', desc: 'Centralized metadata management', tags: ['database', 'catalog', 'metadata'] },
    { id: 'db-sql-formatter', name: 'SQL Formatter', desc: 'Format and beautify SQL queries', tags: ['database', 'sql', 'formatter'] },
    { id: 'db-explain-plan', name: 'Query Explain Plan', desc: 'Analyze query execution plans', tags: ['database', 'explain', 'optimization'] },
    { id: 'db-cost-estimator', name: 'Query Cost Estimator', desc: 'Estimate query execution costs', tags: ['database', 'cost', 'estimation'] },
    { id: 'db-load-balancer', name: 'DB Load Balancer', desc: 'Distribute queries across read replicas', tags: ['database', 'loadbalancer', 'scaling'] },
    { id: 'db-failover', name: 'Failover Manager', desc: 'Automatic failover to standby databases', tags: ['database', 'failover', 'ha'] },
    { id: 'db-recovery', name: 'Point-in-Time Recovery', desc: 'Restore database to specific point in time', tags: ['database', 'recovery', 'backup'] },
    { id: 'db-health-check', name: 'DB Health Check', desc: 'Monitor database health and availability', tags: ['database', 'health', 'monitoring'] }
  ]

  const capsule = capsules[i] || capsules[0]
  return {
    id: capsule.id,
    name: capsule.name,
    category: 'DataViz',
    description: capsule.desc,
    tags: capsule.tags,
    code: `'use client'\nexport default function ${capsule.name.replace(/\s+/g, '')}() {\n  return <div className="p-4">${capsule.name}</div>\n}`,
    platform: 'react' as const
  }
})

export default databaseCapsules
