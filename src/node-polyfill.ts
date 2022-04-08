/**
 * @ignore
 */
let WebSocketConstructor: { new (endpoint: string): WebSocket } = null;

try {
  if (typeof WebSocket !== 'undefined') {
    WebSocketConstructor = WebSocket;
  } else {
    WebSocketConstructor = require('ws');
  }
} catch (err) {
  throw new Error('WebSocket not found. Please install `ws` for node.js');
}

(global as any).WebSocket = WebSocketConstructor;
