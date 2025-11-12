// Ejemplos de Apps para Raspberry Pi 5 con HubLab Capsules

// ============================================
// EJEMPLO 1: Dashboard de Monitoreo del Sistema
// ============================================

// Capsule 1: CPU Temperature Monitor
export function CPUTemperature() {
  const [temp, setTemp] = useState(null);

  useEffect(() => {
    const fetchTemp = async () => {
      // Lee temperatura del Pi via API
      const response = await fetch('/api/pi/temperature');
      const data = await response.json();
      setTemp(data.temp);
    };

    const interval = setInterval(fetchTemp, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-4 rounded-lg ${temp > 70 ? 'bg-red-100' : 'bg-green-100'}`}>
      <h3 className="font-bold">CPU Temperature</h3>
      <div className="text-2xl">{temp}°C</div>
      {temp > 70 && <span className="text-red-600">⚠️ High temperature!</span>}
    </div>
  );
}

// Capsule 2: GPIO Pin Controller
export function GPIOController() {
  const [pins, setPins] = useState({
    17: false, 27: false, 22: false, 23: false
  });

  const togglePin = async (pin) => {
    const newState = !pins[pin];

    // Control GPIO via API
    await fetch('/api/pi/gpio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, value: newState ? 1 : 0 })
    });

    setPins(prev => ({ ...prev, [pin]: newState }));
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-4">GPIO Control</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(pins).map(([pin, state]) => (
          <button
            key={pin}
            onClick={() => togglePin(pin)}
            className={`p-3 rounded ${state ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          >
            Pin {pin}: {state ? 'ON' : 'OFF'}
          </button>
        ))}
      </div>
    </div>
  );
}

// Capsule 3: Camera Stream Viewer
export function CameraStream() {
  const [streaming, setStreaming] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const startStream = () => {
    setStreaming(true);
    // Iniciar stream de la Pi Camera
  };

  const takeSnapshot = async () => {
    const response = await fetch('/api/pi/camera/snapshot');
    const blob = await response.blob();
    setSnapshot(URL.createObjectURL(blob));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-bold mb-4">Pi Camera</h3>

      {streaming ? (
        <img
          src="http://raspberrypi.local:8081/stream"
          alt="Camera stream"
          className="w-full rounded"
        />
      ) : (
        <div className="bg-gray-200 h-64 rounded flex items-center justify-center">
          <button
            onClick={startStream}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Start Stream
          </button>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={takeSnapshot}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          📸 Snapshot
        </button>
      </div>

      {snapshot && (
        <img src={snapshot} alt="Snapshot" className="mt-2 rounded" />
      )}
    </div>
  );
}

// ============================================
// EJEMPLO 2: Sistema de Automatización del Hogar
// ============================================

// Capsule: Smart Light Controller
export function SmartLights() {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Living Room', light: false, brightness: 50 },
    { id: 2, name: 'Kitchen', light: false, brightness: 75 },
    { id: 3, name: 'Bedroom', light: false, brightness: 30 }
  ]);

  const toggleLight = async (roomId) => {
    const room = rooms.find(r => r.id === roomId);

    // Control relé via GPIO
    await fetch('/api/pi/relay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: roomId,
        state: !room.light
      })
    });

    setRooms(prev => prev.map(r =>
      r.id === roomId ? { ...r, light: !r.light } : r
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {rooms.map(room => (
        <div key={room.id} className="p-4 bg-white rounded-lg shadow">
          <h4 className="font-semibold">{room.name}</h4>
          <button
            onClick={() => toggleLight(room.id)}
            className={`mt-2 w-full py-2 rounded ${
              room.light ? 'bg-yellow-400' : 'bg-gray-300'
            }`}
          >
            {room.light ? '💡 ON' : '💡 OFF'}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={room.brightness}
            className="mt-2 w-full"
            onChange={(e) => {/* Ajustar brillo PWM */}}
          />
        </div>
      ))}
    </div>
  );
}

// ============================================
// EJEMPLO 3: Estación Meteorológica
// ============================================

// Capsule: Weather Sensors Dashboard
export function WeatherStation() {
  const [sensors, setSensors] = useState({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    light: 0
  });

  useEffect(() => {
    const readSensors = async () => {
      // Leer sensores I2C/SPI conectados al Pi
      const response = await fetch('/api/pi/sensors');
      const data = await response.json();
      setSensors(data);
    };

    const interval = setInterval(readSensors, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SensorCard
        icon="🌡️"
        label="Temperature"
        value={`${sensors.temperature}°C`}
        color="bg-orange-100"
      />
      <SensorCard
        icon="💧"
        label="Humidity"
        value={`${sensors.humidity}%`}
        color="bg-blue-100"
      />
      <SensorCard
        icon="🔽"
        label="Pressure"
        value={`${sensors.pressure} hPa`}
        color="bg-purple-100"
      />
      <SensorCard
        icon="☀️"
        label="Light"
        value={`${sensors.light} lux`}
        color="bg-yellow-100"
      />
    </div>
  );
}

// ============================================
// EJEMPLO 4: Robot Controller
// ============================================

// Capsule: Robot Movement Control
export function RobotController() {
  const [moving, setMoving] = useState(false);
  const [direction, setDirection] = useState('stop');

  const sendCommand = async (cmd) => {
    setDirection(cmd);
    setMoving(cmd !== 'stop');

    // Enviar comando a motores via GPIO/PWM
    await fetch('/api/pi/robot/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="font-bold text-center mb-4">Robot Control</h3>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        <div></div>
        <button
          onMouseDown={() => sendCommand('forward')}
          onMouseUp={() => sendCommand('stop')}
          className="p-4 bg-blue-500 text-white rounded"
        >
          ⬆️
        </button>
        <div></div>

        <button
          onMouseDown={() => sendCommand('left')}
          onMouseUp={() => sendCommand('stop')}
          className="p-4 bg-blue-500 text-white rounded"
        >
          ⬅️
        </button>
        <button
          onClick={() => sendCommand('stop')}
          className="p-4 bg-red-500 text-white rounded"
        >
          STOP
        </button>
        <button
          onMouseDown={() => sendCommand('right')}
          onMouseUp={() => sendCommand('stop')}
          className="p-4 bg-blue-500 text-white rounded"
        >
          ➡️
        </button>

        <div></div>
        <button
          onMouseDown={() => sendCommand('backward')}
          onMouseUp={() => sendCommand('stop')}
          className="p-4 bg-blue-500 text-white rounded"
        >
          ⬇️
        </button>
        <div></div>
      </div>

      <div className="text-center mt-4">
        Status: {moving ? `Moving ${direction}` : 'Stopped'}
      </div>
    </div>
  );
}

// ============================================
// Backend API para Raspberry Pi (Python/Node.js)
// ============================================

/*
# Python backend example (Flask)
from flask import Flask, jsonify, request
import RPi.GPIO as GPIO
import Adafruit_DHT
from picamera2 import Picamera2
import board
import busio

app = Flask(__name__)

# GPIO Setup
GPIO.setmode(GPIO.BCM)
pins = [17, 27, 22, 23]
for pin in pins:
    GPIO.setup(pin, GPIO.OUT)

# Temperature reading
@app.route('/api/pi/temperature')
def get_temperature():
    with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
        temp = float(f.read()) / 1000.0
    return jsonify({'temp': temp})

# GPIO control
@app.route('/api/pi/gpio', methods=['POST'])
def control_gpio():
    data = request.json
    pin = data['pin']
    value = data['value']
    GPIO.output(pin, value)
    return jsonify({'status': 'success'})

# Sensor reading (DHT22)
@app.route('/api/pi/sensors')
def read_sensors():
    humidity, temperature = Adafruit_DHT.read_retry(
        Adafruit_DHT.DHT22, 4
    )
    return jsonify({
        'temperature': temperature,
        'humidity': humidity,
        'pressure': 1013,  # From BMP280
        'light': 500       # From light sensor
    })

# Robot control
@app.route('/api/pi/robot/move', methods=['POST'])
def move_robot():
    command = request.json['command']

    if command == 'forward':
        # Set motor pins for forward
        GPIO.output(17, GPIO.HIGH)
        GPIO.output(27, GPIO.LOW)
    elif command == 'backward':
        GPIO.output(17, GPIO.LOW)
        GPIO.output(27, GPIO.HIGH)
    elif command == 'stop':
        GPIO.output(17, GPIO.LOW)
        GPIO.output(27, GPIO.LOW)

    return jsonify({'status': 'moving', 'direction': command})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
*/

// ============================================
// Main App - Combines all Raspberry Pi capsules
// ============================================

export default function RaspberryPiDashboard() {
  const [activeTab, setActiveTab] = useState('system');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-2xl font-bold">🍓 Raspberry Pi 5 Control Center</h1>
      </header>

      <nav className="bg-white shadow p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded ${
              activeTab === 'system' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            System Monitor
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded ${
              activeTab === 'home' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Home Automation
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-4 py-2 rounded ${
              activeTab === 'weather' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Weather Station
          </button>
          <button
            onClick={() => setActiveTab('robot')}
            className={`px-4 py-2 rounded ${
              activeTab === 'robot' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Robot Control
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        {activeTab === 'system' && (
          <div className="space-y-6">
            <CPUTemperature />
            <GPIOController />
            <CameraStream />
          </div>
        )}

        {activeTab === 'home' && <SmartLights />}
        {activeTab === 'weather' && <WeatherStation />}
        {activeTab === 'robot' && <RobotController />}
      </main>
    </div>
  );
}