// Create WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

// Create variables
var n_instances = 0;
var speed_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};
var airgap_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};
var current_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};
var voltage_dic = {'min': 1000, 'max': -1, 'mean': 0, 'sdv': 0, 'sum': 0};

// WebSocket event listener
ws.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});

// WebSocket message event listener
ws.addEventListener('message', function (event) {
    const hora = new Date().toLocaleTimeString(); 
    updateHour(hora);   

    const data = JSON.parse(event.data); // Parse JSON data received from WebSocket
    updateValues(data["name"], data["value"]); // Update charts with received data
});



function updateHour(hour){
    time = document.getElementById('time');
    time.innerText = hour;

    }



// Function to update values with received data
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
}

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

function calculateStandardDeviation(value, mean, n_instances, sum) {
    const variance = (sum - n_instances * mean + value) / n_instances;
    return Math.sqrt(variance);
}


// Event listener for the save button
document.getElementById('button-save').addEventListener('click', function() {
    // Obtener las estadísticas
    const statistics = {
        speed: speed_dic,
        airgap: airgap_dic,
        current: current_dic,
        voltage: voltage_dic
    };
    
    
    localStorage.setItem('statistics', JSON.stringify(statistics));

});

