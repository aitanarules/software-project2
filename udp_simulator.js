// Import required modules
const dgram = require('dgram');

// Define address and port
const server_port = 3333;
const client_port = 3334;
const address = '127.0.0.1';

// Create a UDP server
const server = dgram.createSocket('udp4');

// Bind server to the UDP port and address
server.bind(server_port, address, () => {
    console.log(`Server listening on ${address}:${server_port}`);
});

// Define ranges of data fields
const ranges = {
    airgap: [9, 22.5],
    speed: [0, 10],
    current: [0, 13],
    voltage: [170, 270]
};

// Function to get random float values between a range
function getRandomFloatInclusive(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to generate data for a given key
function generateData(key) {
    const [min, max] = ranges[key];
    const value = getRandomFloatInclusive(min, max).toFixed(2);
    return {
        'name': key,
        'value': parseFloat(value),
        'timestamp': Math.floor(new Date().getTime() / 1000)
    };
}

// Loop through each key in ranges and generate and send data every second
setInterval(() => {
    Object.keys(ranges).forEach((key) => {
        const data = generateData(key);
        const message = JSON.stringify(data); // Convert data to JSON string
        server.send(message, client_port, address, (err) => {
            if (err) throw err;
            console.log(`Server sent: ${message}`);
        });
    });
}, 1000);
