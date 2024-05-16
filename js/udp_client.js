
// Import required modules
const dgram = require('dgram'); // UDP Module
const WebSocket = require('ws');

// Define address and port for UDP client and WebSocket server
const udpPort = 3334;
const udpAddress = '127.0.0.1';
const wsPort = 8080;

// Create a UDP client
const udpClient = dgram.createSocket('udp4');

// Create WebSocket server
const wsServer = new WebSocket.Server({ port: wsPort });

// WebSocket server event listener
wsServer.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Send data to WebSocket client when it's connected
    ws.send(JSON.stringify(data));
});

// Listen for messages from the UDP server
udpClient.on('message', (msg, rinfo) => {
    const receivedData = JSON.parse(msg);
    console.log(`Client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    data.push(receivedData); // Add received data to the array

    // Send updated data to all WebSocket clients
    wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(receivedData));
        }
    });
});

// Bind UDP client to specified port and address
udpClient.bind(udpPort, udpAddress, () => {
    console.log(`UDP Client listening on ${udpAddress}:${udpPort}`);
});
