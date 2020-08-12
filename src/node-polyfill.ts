import fetch from 'cross-fetch';

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

/**
 * @ignore
 */
const self: any = global;

self.fetch = fetch;
self.WebSocket = WebSocketConstructor;
