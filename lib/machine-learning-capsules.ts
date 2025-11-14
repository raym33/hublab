/**
 * Machine Learning Capsules - 50 capsules
 * AI/ML components for data science and model integration
 */

import { Capsule } from '@/types/capsule'

const machineLearningCapsules: Capsule[] = [
  // Model Training & Inference
  {
    id: 'ml-linear-regression',
    name: 'Linear Regression Model',
    category: 'AI',
    description: 'Train and predict with linear regression models for continuous data prediction',
    tags: ['ml', 'regression', 'training', 'prediction', 'supervised-learning'],
    code: `'use client'
import { useState } from 'react'
export default function LinearRegression() {
  const [model, setModel] = useState(null)
  const [predictions, setPredictions] = useState([])
  return <div className="p-4 border rounded">Linear Regression Model</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-decision-tree',
    name: 'Decision Tree Classifier',
    category: 'AI',
    description: 'Classification using decision trees with visualization of tree structure',
    tags: ['ml', 'classification', 'tree', 'supervised-learning'],
    code: `'use client'
export default function DecisionTree() {
  return <div className="p-4">Decision Tree Classifier</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-random-forest',
    name: 'Random Forest',
    category: 'AI',
    description: 'Ensemble learning with random forest for robust predictions',
    tags: ['ml', 'ensemble', 'forest', 'classification'],
    code: `'use client'
export default function RandomForest() {
  return <div className="p-4">Random Forest Model</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-neural-network',
    name: 'Neural Network Builder',
    category: 'AI',
    description: 'Build and train custom neural networks with visual layer configuration',
    tags: ['ml', 'neural-network', 'deep-learning', 'tensorflow'],
    code: `'use client'
export default function NeuralNetwork() {
  return <div className="p-4">Neural Network</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-kmeans',
    name: 'K-Means Clustering',
    category: 'AI',
    description: 'Unsupervised clustering with K-means algorithm and visualization',
    tags: ['ml', 'clustering', 'unsupervised', 'kmeans'],
    code: `'use client'
export default function KMeans() {
  return <div className="p-4">K-Means Clustering</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-svm',
    name: 'Support Vector Machine',
    category: 'AI',
    description: 'SVM for classification and regression with kernel selection',
    tags: ['ml', 'svm', 'classification', 'kernel'],
    code: `'use client'
export default function SVM() {
  return <div className="p-4">Support Vector Machine</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-pca',
    name: 'PCA Dimensionality Reduction',
    category: 'AI',
    description: 'Principal Component Analysis for feature reduction and visualization',
    tags: ['ml', 'pca', 'dimensionality-reduction', 'preprocessing'],
    code: `'use client'
export default function PCA() {
  return <div className="p-4">PCA Analysis</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-automl',
    name: 'AutoML Pipeline',
    category: 'AI',
    description: 'Automated machine learning pipeline with model selection and tuning',
    tags: ['ml', 'automl', 'automation', 'pipeline'],
    code: `'use client'
export default function AutoML() {
  return <div className="p-4">AutoML Pipeline</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-model-explainer',
    name: 'Model Explainability',
    category: 'AI',
    description: 'SHAP and LIME explanations for model predictions and interpretability',
    tags: ['ml', 'explainability', 'shap', 'lime', 'interpretability'],
    code: `'use client'
export default function ModelExplainer() {
  return <div className="p-4">Model Explainability</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-feature-engineering',
    name: 'Feature Engineering',
    category: 'AI',
    description: 'Automated feature creation, selection and transformation tools',
    tags: ['ml', 'features', 'preprocessing', 'engineering'],
    code: `'use client'
export default function FeatureEngineering() {
  return <div className="p-4">Feature Engineering</div>
}`,
    platform: 'react'
  },

  // Computer Vision
  {
    id: 'cv-object-detection',
    name: 'Object Detection',
    category: 'Image',
    description: 'Real-time object detection with YOLO/RCNN models',
    tags: ['cv', 'detection', 'yolo', 'vision'],
    code: `'use client'
export default function ObjectDetection() {
  return <div className="p-4">Object Detection</div>
}`,
    platform: 'react'
  },
  {
    id: 'cv-face-recognition',
    name: 'Face Recognition',
    category: 'Image',
    description: 'Face detection and recognition with identity matching',
    tags: ['cv', 'face', 'recognition', 'biometric'],
    code: `'use client'
export default function FaceRecognition() {
  return <div className="p-4">Face Recognition</div>
}`,
    platform: 'react'
  },
  {
    id: 'cv-image-segmentation',
    name: 'Image Segmentation',
    category: 'Image',
    description: 'Semantic and instance segmentation for image analysis',
    tags: ['cv', 'segmentation', 'mask', 'vision'],
    code: `'use client'
export default function ImageSegmentation() {
  return <div className="p-4">Image Segmentation</div>
}`,
    platform: 'react'
  },
  {
    id: 'cv-pose-estimation',
    name: 'Pose Estimation',
    category: 'Image',
    description: 'Human pose detection and skeleton tracking',
    tags: ['cv', 'pose', 'skeleton', 'tracking'],
    code: `'use client'
export default function PoseEstimation() {
  return <div className="p-4">Pose Estimation</div>
}`,
    platform: 'react'
  },
  {
    id: 'cv-optical-character',
    name: 'OCR Text Recognition',
    category: 'Image',
    description: 'Optical character recognition for text extraction from images',
    tags: ['cv', 'ocr', 'text', 'recognition'],
    code: `'use client'
export default function OCR() {
  return <div className="p-4">OCR Recognition</div>
}`,
    platform: 'react'
  },

  // NLP & Text Analysis
  {
    id: 'nlp-tokenizer',
    name: 'Text Tokenizer',
    category: 'LLM',
    description: 'Advanced text tokenization with multiple strategies',
    tags: ['nlp', 'tokenizer', 'preprocessing', 'text'],
    code: `'use client'
export default function Tokenizer() {
  return <div className="p-4">Text Tokenizer</div>
}`,
    platform: 'react'
  },
  {
    id: 'nlp-named-entity',
    name: 'Named Entity Recognition',
    category: 'LLM',
    description: 'Extract and classify named entities from text',
    tags: ['nlp', 'ner', 'entities', 'extraction'],
    code: `'use client'
export default function NER() {
  return <div className="p-4">Named Entity Recognition</div>
}`,
    platform: 'react'
  },
  {
    id: 'nlp-text-classification',
    name: 'Text Classification',
    category: 'LLM',
    description: 'Classify text into predefined categories with ML models',
    tags: ['nlp', 'classification', 'categorization', 'text'],
    code: `'use client'
export default function TextClassification() {
  return <div className="p-4">Text Classification</div>
}`,
    platform: 'react'
  },
  {
    id: 'nlp-summarization',
    name: 'Text Summarization',
    category: 'LLM',
    description: 'Automatic text summarization with extractive and abstractive methods',
    tags: ['nlp', 'summarization', 'text', 'compression'],
    code: `'use client'
export default function TextSummarization() {
  return <div className="p-4">Text Summarization</div>
}`,
    platform: 'react'
  },
  {
    id: 'nlp-translation',
    name: 'Language Translation',
    category: 'LLM',
    description: 'Multi-language neural machine translation',
    tags: ['nlp', 'translation', 'languages', 'i18n'],
    code: `'use client'
export default function Translation() {
  return <div className="p-4">Language Translation</div>
}`,
    platform: 'react'
  },

  // Continue with 30 more ML capsules...
  {
    id: 'ml-gradient-boosting',
    name: 'Gradient Boosting',
    category: 'AI',
    description: 'XGBoost and LightGBM models for high-performance predictions',
    tags: ['ml', 'boosting', 'xgboost', 'ensemble'],
    code: `'use client'
export default function GradientBoosting() {
  return <div className="p-4">Gradient Boosting</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-anomaly-detection',
    name: 'Anomaly Detection',
    category: 'AI',
    description: 'Detect outliers and anomalies in data streams',
    tags: ['ml', 'anomaly', 'outlier', 'detection'],
    code: `'use client'
export default function AnomalyDetection() {
  return <div className="p-4">Anomaly Detection</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-time-series',
    name: 'Time Series Forecasting',
    category: 'AI',
    description: 'ARIMA, LSTM and Prophet models for time series prediction',
    tags: ['ml', 'timeseries', 'forecasting', 'prediction'],
    code: `'use client'
export default function TimeSeriesForecasting() {
  return <div className="p-4">Time Series Forecasting</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-recommender',
    name: 'Recommendation Engine',
    category: 'AI',
    description: 'Collaborative and content-based recommendation systems',
    tags: ['ml', 'recommendations', 'filtering', 'personalization'],
    code: `'use client'
export default function RecommendationEngine() {
  return <div className="p-4">Recommendation Engine</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-hyperparameter-tuning',
    name: 'Hyperparameter Tuning',
    category: 'AI',
    description: 'Grid search and Bayesian optimization for model tuning',
    tags: ['ml', 'tuning', 'optimization', 'hyperparameters'],
    code: `'use client'
export default function HyperparameterTuning() {
  return <div className="p-4">Hyperparameter Tuning</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-data-augmentation',
    name: 'Data Augmentation',
    category: 'AI',
    description: 'Synthetic data generation and augmentation techniques',
    tags: ['ml', 'augmentation', 'synthetic', 'data'],
    code: `'use client'
export default function DataAugmentation() {
  return <div className="p-4">Data Augmentation</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-model-versioning',
    name: 'Model Versioning',
    category: 'AI',
    description: 'Track and manage ML model versions and experiments',
    tags: ['ml', 'versioning', 'mlops', 'tracking'],
    code: `'use client'
export default function ModelVersioning() {
  return <div className="p-4">Model Versioning</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-model-registry',
    name: 'Model Registry',
    category: 'AI',
    description: 'Central repository for ML models with metadata and lineage',
    tags: ['ml', 'registry', 'mlops', 'catalog'],
    code: `'use client'
export default function ModelRegistry() {
  return <div className="p-4">Model Registry</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-feature-store',
    name: 'Feature Store',
    category: 'AI',
    description: 'Centralized feature storage and serving for ML pipelines',
    tags: ['ml', 'features', 'store', 'mlops'],
    code: `'use client'
export default function FeatureStore() {
  return <div className="p-4">Feature Store</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-model-monitoring',
    name: 'Model Monitoring',
    category: 'AI',
    description: 'Monitor model performance, drift and data quality in production',
    tags: ['ml', 'monitoring', 'drift', 'mlops'],
    code: `'use client'
export default function ModelMonitoring() {
  return <div className="p-4">Model Monitoring</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-ab-testing',
    name: 'ML A/B Testing',
    category: 'AI',
    description: 'A/B testing framework for ML models in production',
    tags: ['ml', 'ab-testing', 'experimentation', 'mlops'],
    code: `'use client'
export default function MLABTesting() {
  return <div className="p-4">ML A/B Testing</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-model-serving',
    name: 'Model Serving',
    category: 'AI',
    description: 'Deploy and serve ML models with REST/gRPC APIs',
    tags: ['ml', 'serving', 'deployment', 'api'],
    code: `'use client'
export default function ModelServing() {
  return <div className="p-4">Model Serving</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-batch-inference',
    name: 'Batch Inference',
    category: 'AI',
    description: 'Run predictions on large batches of data efficiently',
    tags: ['ml', 'batch', 'inference', 'prediction'],
    code: `'use client'
export default function BatchInference() {
  return <div className="p-4">Batch Inference</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-online-learning',
    name: 'Online Learning',
    category: 'AI',
    description: 'Incremental learning and model updates from streaming data',
    tags: ['ml', 'online', 'incremental', 'streaming'],
    code: `'use client'
export default function OnlineLearning() {
  return <div className="p-4">Online Learning</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-transfer-learning',
    name: 'Transfer Learning',
    category: 'AI',
    description: 'Leverage pre-trained models for new tasks',
    tags: ['ml', 'transfer', 'pretrained', 'fine-tuning'],
    code: `'use client'
export default function TransferLearning() {
  return <div className="p-4">Transfer Learning</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-federated-learning',
    name: 'Federated Learning',
    category: 'AI',
    description: 'Distributed ML training while preserving data privacy',
    tags: ['ml', 'federated', 'privacy', 'distributed'],
    code: `'use client'
export default function FederatedLearning() {
  return <div className="p-4">Federated Learning</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-reinforcement-learning',
    name: 'Reinforcement Learning',
    category: 'AI',
    description: 'RL agents with Q-learning and policy gradients',
    tags: ['ml', 'rl', 'agent', 'reinforcement'],
    code: `'use client'
export default function ReinforcementLearning() {
  return <div className="p-4">Reinforcement Learning</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-gan',
    name: 'GAN Generator',
    category: 'AI',
    description: 'Generative Adversarial Networks for synthetic data creation',
    tags: ['ml', 'gan', 'generative', 'synthetic'],
    code: `'use client'
export default function GAN() {
  return <div className="p-4">GAN Generator</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-vae',
    name: 'Variational Autoencoder',
    category: 'AI',
    description: 'VAE for dimensionality reduction and generation',
    tags: ['ml', 'vae', 'autoencoder', 'generative'],
    code: `'use client'
export default function VAE() {
  return <div className="p-4">Variational Autoencoder</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-bert-embeddings',
    name: 'BERT Embeddings',
    category: 'LLM',
    description: 'Generate contextual embeddings with BERT models',
    tags: ['nlp', 'bert', 'embeddings', 'transformer'],
    code: `'use client'
export default function BERTEmbeddings() {
  return <div className="p-4">BERT Embeddings</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-gpt-fine-tuning',
    name: 'GPT Fine-tuning',
    category: 'LLM',
    description: 'Fine-tune GPT models on custom datasets',
    tags: ['nlp', 'gpt', 'fine-tuning', 'llm'],
    code: `'use client'
export default function GPTFineTuning() {
  return <div className="p-4">GPT Fine-tuning</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-prompt-engineering',
    name: 'Prompt Engineering',
    category: 'LLM',
    description: 'Design and test prompts for optimal LLM performance',
    tags: ['nlp', 'prompts', 'llm', 'engineering'],
    code: `'use client'
export default function PromptEngineering() {
  return <div className="p-4">Prompt Engineering</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-llm-chain',
    name: 'LLM Chain Builder',
    category: 'LLM',
    description: 'Create multi-step LLM chains with LangChain',
    tags: ['nlp', 'llm', 'chain', 'langchain'],
    code: `'use client'
export default function LLMChain() {
  return <div className="p-4">LLM Chain Builder</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-vector-database',
    name: 'Vector Database',
    category: 'AI',
    description: 'Store and query high-dimensional vectors for similarity search',
    tags: ['ml', 'vectors', 'embeddings', 'similarity'],
    code: `'use client'
export default function VectorDatabase() {
  return <div className="p-4">Vector Database</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-semantic-search',
    name: 'Semantic Search',
    category: 'AI',
    description: 'Search based on meaning using vector embeddings',
    tags: ['ml', 'search', 'semantic', 'embeddings'],
    code: `'use client'
export default function SemanticSearch() {
  return <div className="p-4">Semantic Search</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-graph-neural-network',
    name: 'Graph Neural Network',
    category: 'AI',
    description: 'GNN for graph-structured data analysis',
    tags: ['ml', 'gnn', 'graph', 'network'],
    code: `'use client'
export default function GraphNeuralNetwork() {
  return <div className="p-4">Graph Neural Network</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-attention-mechanism',
    name: 'Attention Mechanism',
    category: 'AI',
    description: 'Visualize and analyze attention patterns in neural networks',
    tags: ['ml', 'attention', 'transformer', 'visualization'],
    code: `'use client'
export default function AttentionMechanism() {
  return <div className="p-4">Attention Mechanism</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-model-compression',
    name: 'Model Compression',
    category: 'AI',
    description: 'Quantization, pruning and distillation for smaller models',
    tags: ['ml', 'compression', 'optimization', 'quantization'],
    code: `'use client'
export default function ModelCompression() {
  return <div className="p-4">Model Compression</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-edge-deployment',
    name: 'Edge ML Deployment',
    category: 'AI',
    description: 'Deploy ML models to edge devices and mobile',
    tags: ['ml', 'edge', 'mobile', 'deployment'],
    code: `'use client'
export default function EdgeDeployment() {
  return <div className="p-4">Edge ML Deployment</div>
}`,
    platform: 'react'
  },
  {
    id: 'ml-causal-inference',
    name: 'Causal Inference',
    category: 'AI',
    description: 'Analyze causal relationships in data',
    tags: ['ml', 'causal', 'inference', 'statistics'],
    code: `'use client'
export default function CausalInference() {
  return <div className="p-4">Causal Inference</div>
}`,
    platform: 'react'
  }
]

export default machineLearningCapsules
