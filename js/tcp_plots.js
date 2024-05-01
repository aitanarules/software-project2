// https://plotly.com/javascript/streaming/

// Create WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

// Variables 
var timestamps = [];
var speeds = [];
var times = [];

// Elements
canvas1 = document.getElementById('canvas1');


const ranges = {
    airgap: [9, 22.5],
    speed: [0, 10],
    current: [0, 13],
    voltage: [170, 270]
};

// WebSocket event listener
ws.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
    chart2();

});

// WebSocket message event listener
ws.addEventListener('message', function (event) {
    const currentTime = new Date().toLocaleTimeString(); 

    const data = JSON.parse(event.data); // Parse JSON data received from WebSocket
    updateTime(currentTime, data["timestamp"]);   
    updateValues(data["name"], data["value"], data["timestamp"]); // Update charts with received data
    chart(canvas1, 'Speed', speeds);
});

// Function to update hour display
function updateTime(currentTime, timestamp){
    times.push(currentTime)
    // timestamps.push(timestamp)   
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
function updateValues(name, value, timestamp ) {   

    if (name == "speed") {
        speeds.push(value)
        timestamps.push(timestamp) }
    }

// charts
function chart(element, variable, values){
   
    // Display using Plotly
    const data = [{x:timestamps, y:values, mode:"lines"}];
    const layout = {title: variable};
    Plotly.newPlot(element, data, layout);
}


// let exp = "Math.sin(x)";
// var cnt=0;
// // Generate values
// const xValues = [];
// const yValues = [];
// for (let x = 0; x <= 10; x += 0.1) {
//   xValues.push(x);
//   yValues.pussh(eval(exp));
// }

// // Display using Plotly
// const data = [{x:timestamps, y:speeds, mode:"lines"}];
// const layout = {title: "y = " + exp};
// Plotly.newPlot(canvas1, data, layout);

function chart2(){
    canvas2 = document.getElementById('canvas2')
    function rand() {
        return Math.random();
      }
      
      var time = new Date();
      
      var data = [{
        x: [time],
        y: [rand],
        mode: 'lines',
        line: {color: '#80CAF6'}
      }]
      
      Plotly.newPlot(canvas2, data);
      
      var cnt = 0;
      
      var interval = setInterval(function() {
      
        var time = new Date();
      
        var update = {
        x:  [[time]],
        y: [[rand()]]
        }
      
        var olderTime = time.setMinutes(time.getMinutes() - 1);
        var futureTime = time.setMinutes(time.getMinutes() + 1);
      
        var minuteView = {
              xaxis: {
                type: 'date',
                range: [olderTime,futureTime]
              }
            };
      
        Plotly.relayout(canvas2, minuteView);
        Plotly.extendTraces(canvas2, update, [0])
      
        if(++cnt === 100) clearInterval(interval);
      }, 1000);
      
}

