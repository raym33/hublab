// Example: RAG System with LM Studio and Python Backend
// Shows how capsules can create a complete RAG (Retrieval Augmented Generation) application

// Capsule 1: Document Upload
export function DocumentUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append('document', file);

      try {
        // Send to Python backend for processing
        const response = await fetch('/api/rag/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        setDocuments(prev => [...prev, {
          name: file.name,
          id: result.document_id,
          chunks: result.chunks_created,
          status: 'indexed'
        }]);

        onUpload(result);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setUploading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Document Library</h3>

      <div className="mb-4">
        <label className="block p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
          <input
            type="file"
            multiple
            accept=".txt,.pdf,.docx,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-center">
            <span className="text-gray-600">
              {uploading ? '📤 Uploading...' : '📁 Click to upload documents'}
            </span>
          </div>
        </label>
      </div>

      <div className="space-y-2">
        {documents.map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">{doc.name}</span>
            <span className="text-xs text-green-600">{doc.chunks} chunks</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Capsule 2: Vector Search Interface
export function VectorSearch({ query, onResults }) {
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const performSearch = async () => {
    if (!query) return;

    setSearching(true);
    try {
      // Call Python backend for vector similarity search
      const response = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          top_k: 5,
          threshold: 0.7
        })
      });

      const results = await response.json();
      setSearchResults(results.matches);
      onResults(results.matches);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(performSearch, 500);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold mb-2">Relevant Context</h4>
      {searching ? (
        <div className="text-sm text-gray-600">Searching vectors...</div>
      ) : (
        <div className="space-y-2">
          {searchResults.map((result, idx) => (
            <div key={idx} className="p-2 bg-white rounded text-sm">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Score: {result.score.toFixed(3)}</span>
                <span className="text-gray-500">{result.source}</span>
              </div>
              <div className="text-gray-700">{result.text.substring(0, 150)}...</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Capsule 3: LM Studio Integration
export function LMStudioChat({ query, context, onResponse }) {
  const [generating, setGenerating] = useState(false);
  const [response, setResponse] = useState('');

  const generateResponse = async () => {
    if (!query) return;

    setGenerating(true);
    try {
      // Build RAG prompt with context
      const ragPrompt = `Context information:
${context.map(c => c.text).join('\n\n')}

Based on the above context, please answer the following question:
${query}

Answer:`;

      // Call LM Studio API (local)
      const response = await fetch('http://localhost:1234/v1/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: ragPrompt,
          max_tokens: 500,
          temperature: 0.7,
          stop: ['\n\nQuestion:', '\n\nContext:']
        })
      });

      const data = await response.json();
      const generatedText = data.choices[0].text;
      setResponse(generatedText);
      onResponse(generatedText);
    } catch (error) {
      console.error('LM Studio error:', error);
      setResponse('Error: Could not connect to LM Studio. Ensure it\'s running on port 1234.');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (query && context.length > 0) {
      generateResponse();
    }
  }, [query, context]);

  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <h4 className="font-semibold mb-2">AI Response</h4>
      {generating ? (
        <div className="flex items-center gap-2">
          <div className="animate-pulse">🤖 Generating response...</div>
        </div>
      ) : (
        <div className="whitespace-pre-wrap text-gray-800">{response}</div>
      )}
    </div>
  );
}

// Capsule 4: Python Backend Status
export function BackendStatus() {
  const [status, setStatus] = useState({
    lmstudio: 'checking',
    vectordb: 'checking',
    python: 'checking'
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check Python backend
        const pythonRes = await fetch('/api/rag/status');
        const pythonData = await pythonRes.json();

        // Check LM Studio
        const lmRes = await fetch('http://localhost:1234/v1/models').catch(() => null);

        setStatus({
          python: pythonData ? 'online' : 'offline',
          vectordb: pythonData?.vectordb_status || 'offline',
          lmstudio: lmRes ? 'online' : 'offline'
        });
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 p-2 bg-gray-100 rounded">
      {Object.entries(status).map(([service, state]) => (
        <div key={service} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            state === 'online' ? 'bg-green-500' :
            state === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs capitalize">{service}</span>
        </div>
      ))}
    </div>
  );
}

// Capsule 5: Query Input
export function QueryInput({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question about your documents..."
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Ask
      </button>
    </form>
  );
}

// Main RAG Application - Combines all capsules
export default function App() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [context, setContext] = useState([]);
  const [conversations, setConversations] = useState([]);

  const handleQuery = (query) => {
    setCurrentQuery(query);
    setConversations(prev => [...prev, { type: 'question', text: query }]);
  };

  const handleSearchResults = (results) => {
    setContext(results);
  };

  const handleResponse = (response) => {
    setConversations(prev => [...prev, { type: 'answer', text: response }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">RAG System with LM Studio</h1>
          <BackendStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Document upload */}
          <div className="lg:col-span-1">
            <DocumentUpload onUpload={() => {}} />
          </div>

          {/* Main content - Q&A interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query input */}
            <div className="bg-white p-6 rounded-lg shadow">
              <QueryInput onSubmit={handleQuery} />
            </div>

            {/* Vector search results */}
            {currentQuery && (
              <VectorSearch
                query={currentQuery}
                onResults={handleSearchResults}
              />
            )}

            {/* LM Studio response */}
            {context.length > 0 && (
              <LMStudioChat
                query={currentQuery}
                context={context}
                onResponse={handleResponse}
              />
            )}

            {/* Conversation history */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Conversation History</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversations.map((conv, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded ${
                      conv.type === 'question' ? 'bg-blue-50' : 'bg-green-50'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {conv.type === 'question' ? '❓ Question' : '💡 Answer'}
                    </div>
                    <div className="text-sm">{conv.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}