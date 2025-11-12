// Example: Chatbot with Coqui TTS and Ollama Integration
// This demonstrates how capsules can integrate with local AI services

// Capsule 1: Voice Input Component
export function VoiceInput({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      // Send to speech-to-text service
      const formData = new FormData();
      formData.append('audio', blob);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      });
      const { transcript } = await response.json();
      onTranscript(transcript);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-4 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {isRecording ? '🛑 Stop' : '🎤 Record'}
      </button>
      {isRecording && <span className="animate-pulse">Recording...</span>}
    </div>
  );
}

// Capsule 2: Ollama Chat Interface
export function OllamaChat({ message, onResponse }) {
  const [loading, setLoading] = useState(false);

  const sendToOllama = async () => {
    setLoading(true);
    try {
      // Call local Ollama API
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: message,
          stream: false
        })
      });

      const data = await response.json();
      onResponse(data.response);
    } catch (error) {
      console.error('Ollama error:', error);
      onResponse('Error connecting to Ollama. Make sure it\'s running locally.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) sendToOllama();
  }, [message]);

  return (
    <div className="p-4 bg-gray-100 rounded">
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Thinking...</span>
        </div>
      ) : (
        <div>Ready for input</div>
      )}
    </div>
  );
}

// Capsule 3: Coqui TTS Output
export function CoquiTTS({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const speakText = async () => {
    if (!text) return;

    setIsPlaying(true);
    try {
      // Call Coqui TTS API (running locally)
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: 'en_US/cmu-arctic_low#slt'
        })
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      await audioRef.current.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded">
      <button
        onClick={speakText}
        disabled={isPlaying || !text}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isPlaying ? '🔊 Playing...' : '🔊 Speak'}
      </button>
      <div className="flex-1 text-sm">{text || 'No response yet'}</div>
    </div>
  );
}

// Capsule 4: Chat Message
export function ChatMessage({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}>
        <div className="text-sm font-semibold mb-1">
          {isUser ? 'You' : 'AI Assistant'}
        </div>
        <div>{message}</div>
      </div>
    </div>
  );
}

// Capsule 5: Chat History
export function ChatHistory({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-inner">
      {messages.map((msg, index) => (
        <ChatMessage key={index} {...msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
}

// Main Chatbot App - Combines all capsules
export default function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [lastResponse, setLastResponse] = useState('');

  const handleTranscript = (transcript) => {
    setCurrentMessage(transcript);
    setMessages(prev => [...prev, { message: transcript, isUser: true }]);
  };

  const handleOllamaResponse = (response) => {
    setMessages(prev => [...prev, { message: response, isUser: false }]);
    setLastResponse(response);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      setMessages(prev => [...prev, { message: currentMessage, isUser: true }]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Chatbot with Voice
        </h1>

        <div className="bg-white rounded-lg shadow-xl h-[600px] flex flex-col">
          <ChatHistory messages={messages} />

          <div className="border-t p-4">
            <OllamaChat
              message={messages[messages.length - 1]?.isUser ? messages[messages.length - 1].message : null}
              onResponse={handleOllamaResponse}
            />

            <CoquiTTS text={lastResponse} />

            <form onSubmit={handleTextSubmit} className="flex gap-2 mt-4">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="Type a message..."
              />
              <VoiceInput onTranscript={handleTranscript} />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}