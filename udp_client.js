// Import required modules
const fs = require('fs');       // File System Module
const dgram = require('dgram'); // UDP Module

// Define address and port
const port = 3334;
const address = '127.0.0.1';

// // Create a UDP client
const client = dgram.createSocket('udp4');
const data = []; // Array to store received data


// Listen for messages from the server
client.on('message', (msg, rinfo) => {
    const receivedData = JSON.parse(msg);
    console.log(`Client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    data.push(receivedData); // Add received data to the array
});

// Bind client to specified port and address

client.bind(port, address, () => {
    console.log(`Client listening on ${address}:${port}`);
});

// Function to save the data to a JSON file
function saveDataToFile() {
    const jsonData = JSON.stringify(data, null, 2); // Convert the array to JSON format
    fs.writeFile('data.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error while saving the file:', err);
        } else {
            console.log('Data saved to data.json');
        }
    });
}

// Example: when a message is received from the client to save the data
// You can call the saveDataToFile function
// In this example, it executes after 10 seconds
setTimeout(saveDataToFile, 10000); // Change the time according to your needs
