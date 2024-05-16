
// Create WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

// Create variables
var n_instances = 0;
var speed_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};
var airgap_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};
var current_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};
var voltage_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};

var instancesArray = []; // Variable to store all instances
const startTime = new Date();
var second = 0;

var times = [];
var timestamps = [];
var seconds = [];

var speeds = [];
var airgaps = [];
var currents = [];
var voltages = [];

const ranges = {
    'airgap': [10, 22.5],
    'speed': [0, 10],
    'current': [0, 13],
    'voltage': [170, 270]
};

// Obtain the DOM elements

const speed = document.getElementById('speed');
const min_speed = document.getElementById('min-s');
const mean_speed = document.getElementById('mean-s');
const max_speed = document.getElementById('max-s');
const sdv_speed = document.getElementById('sdv-s');

const airgap = document.getElementById('airgap');
const min_airgap = document.getElementById('min-a');
const mean_airgap = document.getElementById('mean-a');
const max_airgap = document.getElementById('max-a');
const sdv_airgap = document.getElementById('sdv-a');

const current = document.getElementById('current');
const min_current = document.getElementById('min-c');
const mean_current = document.getElementById('mean-c');
const max_current = document.getElementById('max-c');
const sdv_current = document.getElementById('sdv-c');

const voltage = document.getElementById('voltage');
const min_voltage = document.getElementById('min-v');
const mean_voltage = document.getElementById('mean-v');
const max_voltage = document.getElementById('max-v');
const sdv_voltage = document.getElementById('sdv-v');


canvas1 = document.getElementById('canvas1');
canvas2 = document.getElementById('canvas2');
canvas3 = document.getElementById('canvas3');
canvas4 = document.getElementById('canvas4');

dom_time = document.getElementById('time');
dom_timer = document.getElementById('timer');


// WebSocket event listener
ws.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});

// WebSocket message event listener
ws.addEventListener('message', function (event) {
    const data = JSON.parse(event.data); // Parse JSON data received from WebSocket

    const currentTime = new Date().toLocaleTimeString(); 
    const currentDate = new Date();

    updateHour(currentTime);   
    updateDisplay(currentDate, startTime);

    const elapsedTime = currentDate.getTime() - startTime.getTime();
    let second = Math.floor(elapsedTime / 1000);

    updateValues(data["name"], data["value"], data["timestamp"], currentTime, second); // Update charts with received data

    
    instancesArray.push({                       // Add data to instances array
        timestamp: data["timestamp"], // Date(data['timestamp']*1000),
        variable: data["name"],
        value: data["value"]

    });

    chart(canvas1, 'Speed', speeds)
    chart(canvas2, 'Airgap', airgaps)
    chart(canvas3, 'Current', currents)
    chart(canvas4, 'Voltage', voltages)

});

// Function to update hour display
function updateHour(hour){
    dom_time.innerText = hour;
    // times.push(hour);
}


function updateDisplay(currentDate, startTime) {
    // Difference in miliseconds
    const elapsedTime = currentDate.getTime() - startTime.getTime();

    // Compute the hours, minutes, seconds and miliseconds
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60) % 60;
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60; // restart seconds when overflows 60
    minutes = padNumber(minutes, 2);
    hours = padNumber(hours, 2);
    seconds = padNumber(seconds, 2);

    const timerText = `${hours}:${minutes}:${seconds}`;
    dom_timer.innerText = timerText;
}


// Fuction to fill 0 at left
function padNumber(number, length) {
    return String(number).padStart(length, '0');
}

// Function to update values with received data
function updateColor(name='speed', value) {
    const range = ranges[name];
    if (value < range[0]){
        document.getElementById(name).style.color = 'blue';
    }else if(value > range[1]){
        document.getElementById(name).style.color = 'red';
    }else {
        document.getElementById(name).style.color = 'black';
    }
}

// Function to update values
function updateValues(name, value, timestamp, hour, second) {   

    if (name == "speed") {
        timestamps.push(timestamp)   // We put it here to just get just one
        times.push(hour)
        seconds.push(second)
        n_instances++;

        speeds.push(value)
        speed.innerText = `${value}`;
        updateStats(speed_dic, value, min_speed, mean_speed, max_speed, sdv_speed);
    } else if (name == "airgap") {
        airgap.innerText = `${value}`;
        airgaps.push(value);
        updateStats(airgap_dic, value, min_airgap, mean_airgap, max_airgap, sdv_airgap);
    } else if (name == "current") {
        current.innerText = `${value}`;
        currents.push(value);
        updateStats(current_dic, value, min_current, mean_current, max_current, sdv_current);
    } else if (name == "voltage") {
        voltage.innerText = `${value}`;
        voltages.push(value);
        updateStats(voltage_dic, value, min_voltage, mean_voltage, max_voltage, sdv_voltage);
    }

    updateColor(name, value);
}


// Function to update statistics
function updateStats(dic, value, min_elem, mean_elem, max_elem, sdv_elem) {
    if (value < dic['min']) {
        dic['min'] = value;
        min_elem.innerText = value;
    }
    if (value > dic['max']) {
        dic['max'] = value;
        max_elem.innerText = value;
    }
    dic['sum'] += value;
    dic['mean'] = dic['sum'] / n_instances;
    mean_elem.innerText = dic['mean'].toFixed(2);
    dic['sdv'] = calculateStandardDeviation(value, dic['mean'], n_instances, dic['sum']);
    sdv_elem.innerText = dic['sdv'].toFixed(2);
}

// Function to calculate standard deviation
function calculateStandardDeviation(value, mean, n_instances, sum) {
    const variance = (sum - n_instances * mean + value) / n_instances;
    return Math.sqrt(variance);
}

// Function to save instances to JSON file
function saveInstancesToJson() {
    // if (instancesArray.length > 0) {
    //     instancesArray.shift();
    // }

    const jsonData = JSON.stringify(instancesArray);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'instances.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    

}

// Function to save instances to CSV file
function saveInstancesToCSV() {

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,Variable,Value\n";
    instancesArray.forEach(function(instance) {
        csvContent += `${instance.timestamp},${instance.variable},${instance.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "instances.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "instances.csv".
}

// Event listener for button click save
document.getElementById('button-save-json').addEventListener('click', saveInstancesToJson);
document.getElementById('button-save-csv').addEventListener('click', saveInstancesToCSV);

// Event listener to open a new window when click "Help"
document.getElementById('button-info').addEventListener('click', function() {
    // New window
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h2>Helpful information</h2>
            <span class="close-button">&times;</span>
        </div>
        <p> In this dashboard you will find the real-time data of the hyperloop POD. The units in which each variable is measured are the following: </p>
        <ul>
            <li> Speed m/s</li>
            <li>Airgap mm</li>
            <li>Current A</li>
            <li>Voltage V</li>
            
        </ul>
        <p>Additionally, you can find a save button to store the values displayed so far in .csv and json format.</p>
        <p>Below, you'll see 4 charts that represent the last 60 values of each of the variables: the x-axis refers to seconds (since the execution time), while the y-axis refers to each of the ranges of the variable.</p>`
        ;

    //Add window to body
    document.body.appendChild(modal);

    // Darken the background
    document.body.classList.add('modal-open');

    // Event listener to close the window
    modal.querySelector('.close-button').addEventListener('click', function() {
        // Remove window
        modal.parentNode.removeChild(modal);
        // Remove darken
        document.body.classList.remove('modal-open');
    });
});



//Function to update charts


function chart(element, variable, values){
    let seconds_plot = seconds;
    if (values.length>60){
        seconds_plot = seconds_plot.slice(-60);
        values = values.slice(-60);
    }
   
    // Display using Plotly
    const data = [{x:seconds_plot, y:values, mode:"lines", line: {color: '#80CAF6'}}];
    const layout = {title: variable};
    Plotly.newPlot(element, data, layout);
}



// Menu

function openNav() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }