const { io } = require('socket.io-client');

const socket = io('http://127.0.0.1:3002', {
  transports: ['websocket'],
  timeout: 5000
});

socket.on('connect', () => {
  console.log('Successfully connected to WebSocket server!');
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('Connection timed out');
  process.exit(1);
}, 6000);
