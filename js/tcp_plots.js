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

const ranges = {
    airgap: [9, 22.5],
    speed: [0, 10],
    current: [0, 13],
    voltage: [170, 270]
};

// WebSocket event listener
ws.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});

// WebSocket message event listener
ws.addEventListener('message', function (event) {
    const currentTime = new Date().toLocaleTimeString(); 
    const currentDate = new Date();

    updateHour(currentTime);   
    updateDisplay(currentDate, startTime);

    const data = JSON.parse(event.data); // Parse JSON data received from WebSocket
    updateValues(data["name"], data["value"]); // Update charts with received data
    // Add data to instances array
    instancesArray.push({
        timestamp: data["timestamp"],
        variable: data["name"],
        value: data["value"]
    });

    const timestamp = new Date(data.timestamp);



});

// Function to update hour display
function updateHour(hour){
    time = document.getElementById('time');
    time.innerText = hour;

    timer = document.getElementById('timer');
    
}


function updateDisplay(currentDate, startTime) {
    // Calcular la diferencia en milisegundos
    const elapsedTime = currentDate.getTime() - startTime.getTime();

    // Calcular las horas, minutos, segundos y milisegundos
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60) % 60;
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60; // Reiniciar los segundos cuando exceden los 60
    minutes = padNumber(minutes, 2);
    hours = padNumber(hours, 2);
    seconds = padNumber(seconds, 2);

    // Construir el texto del cronómetro
    const timerText = `${hours}:${minutes}:${seconds}`;

    // Actualizar el contenido del elemento "timer"
    document.getElementById('timer').innerText = timerText;
}


// Función para rellenar números con ceros a la izquierda
function padNumber(number, length) {
    return String(number).padStart(length, '0');
}

// Function to update values with received data
function updateColor(name, value) {
    const range = ranges[name];
    if (value < range[0]) {
        document.getElementById(name).style.color = 'blue';
    }else if(value > range[1]){
        document.getElementById(name).style.color = 'red';

    }else {
        document.getElementById(name).style.color = 'black';
    }
}

// Luego, llamas a esta función en la función updateValues
function updateValues(name, value) {    
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

    if (name == "speed") {
        speed.innerText = `${value}`;
        updateStats(speed_dic, value, min_speed, mean_speed, max_speed, sdv_speed);
    } else if (name == "airgap") {
        airgap.innerText = `${value}`;
        updateStats(airgap_dic, value, min_airgap, mean_airgap, max_airgap, sdv_airgap);
    } else if (name == "current") {
        current.innerText = `${value}`;
        updateStats(current_dic, value, min_current, mean_current, max_current, sdv_current);
    } else if (name == "voltage") {
        voltage.innerText = `${value}`;
        updateStats(voltage_dic, value, min_voltage, mean_voltage, max_voltage, sdv_voltage);
    }

    // Llamar a la función updateColor para actualizar el color del texto
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
    n_instances++;
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
        <p> Additionally, you can find a save button to store the values displayed so far in .csv and json format.</p>
    `;

    //Add window to body
    document.body.appendChild(modal);

    // Darken the background
    document.body.classList.add('modal-open');

    // Event listener to close the windowe
    modal.querySelector('.close-button').addEventListener('click', function() {
        // Remove window
        modal.parentNode.removeChild(modal);
        // Remove darken
        document.body.classList.remove('modal-open');
    });
});



// charts



// menu


function openNav() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }