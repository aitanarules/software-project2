// Other help-info event
function openHelp() {
    document.getElementById("help-info").style.display = "block";
}

function closeHelp() {
    document.getElementById("help-info").style.display = "none";
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


function showFileContent() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        const jsonData = JSON.parse(event.target.result);

        const plot = document.getElementById('plot');

        function extractValues(data, variableName) {
            return data.filter(item => item.variable === variableName).map(item => item.value);
        }

        function timestampToDate(timestamp) {
            return new Date(timestamp * 1000); // Transform to seconds
        }

        const uniqueTimestamps = [...new Set(jsonData.map(item => item.timestamp))]; // Get usnique timestamps

        const airgapValues = extractValues(jsonData, 'airgap');
        const speedValues = extractValues(jsonData, 'speed');
        const currentValues = extractValues(jsonData, 'current');
        const voltageValues = extractValues(jsonData, 'voltage');

        const trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'Airgap',
            x: uniqueTimestamps.map(timestampToDate),
            y: airgapValues,
            line: {color: '#17BECF'}
        };

        const trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'Speed',
            x: uniqueTimestamps.map(timestampToDate),
            y: speedValues,
            line: {color: '#FF5733'}
        };

        const trace3 = {
            type: "scatter",
            mode: "lines",
            name: 'Current',
            x: uniqueTimestamps.map(timestampToDate),
            y: currentValues,
            line: {color: '#FFFF00'}
        };

        const trace4 = {
            type: "scatter",
            mode: "lines",
            name: 'Voltage',
            x: uniqueTimestamps.map(timestampToDate),
            y: voltageValues,
            line: {color: '#4CAF50'}
        };

        const data = [trace1, trace2, trace3, trace4];
        const layout = {
            title: 'Historical data',
            xaxis: {
                title: 'Date'
            },
            yaxis: {
                title: 'Value'
            }
        };

        Plotly.newPlot(plot, data, layout);
      };
      
      reader.readAsText(file);
    } else {
      alert('Please, select a JSON file');
    }
}



function showFileContentScaled() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const jsonData = JSON.parse(event.target.result);

            const plot = document.getElementById('plot');

            const ranges = {
                'airgap': [10, 22.5],
                'speed': [0, 10],
                'current': [0, 13],
                'voltage': [170, 270]
            };

            function extractValues(data, variableName) {
                return data.filter(item => item.variable === variableName).map(item => item.value);
            }

            function timestampToDate(timestamp) {
                return new Date(timestamp * 1000); // Transformar a milisegundos
            }

            const timestamps = [...new Set(jsonData.map(item => item.timestamp))]; // Obtener timestamps únicos

            const airgapValues = extractValues(jsonData, 'airgap');
            const speedValues = extractValues(jsonData, 'speed');
            const currentValues = extractValues(jsonData, 'current');
            const voltageValues = extractValues(jsonData, 'voltage');

            // Function to scale data using Min-Max scaling with provided ranges
            function scaleDataMinMax(values, min, max) {
                return values.map(val => (val - min) / (max - min));
            }

            // Escalar los datos con Min-Max utilizando los rangos proporcionados
            const airgapValuesScaled = scaleDataMinMax(airgapValues, ranges.airgap[0], ranges.airgap[1]);
            const speedValuesScaled = scaleDataMinMax(speedValues, ranges.speed[0], ranges.speed[1]);
            const currentValuesScaled = scaleDataMinMax(currentValues, ranges.current[0], ranges.current[1]);
            const voltageValuesScaled = scaleDataMinMax(voltageValues, ranges.voltage[0], ranges.voltage[1]);

            // Plotly traces with scaled data
            const trace1 = {
                type: "scatter",
                mode: "lines",
                name: 'Airgap Scaled',
                x: timestamps.map(timestampToDate),
                y: airgapValuesScaled,
                line: {color: '#17BECF'}
            };

            const trace2 = {
                type: "scatter",
                mode: "lines",
                name: 'Speed Scaled',
                x: timestamps.map(timestampToDate),
                y: speedValuesScaled,
                line: {color: '#FF5733'}
            };

            const trace3 = {
                type: "scatter",
                mode: "lines",
                name: 'Current Scaled',
                x: timestamps.map(timestampToDate),
                y: currentValuesScaled,
                line: {color: '#FFFF00'}
            };

            const trace4 = {
                type: "scatter",
                mode: "lines",
                name: 'Voltage Scaled',
                x: timestamps.map(timestampToDate),
                y: voltageValuesScaled,
                line: {color: '#4CAF50'}
            };

            const data = [trace1, trace2, trace3, trace4];
            const layout = {
                title: 'Scaled Historical Data',
                xaxis: {
                    title: 'Date'
                },
                yaxis: {
                    title: 'Scaled Value'
                }
            };
            console.log(speedValuesScaled)
            console.log(speedValues)
            Plotly.newPlot(plot, data, layout);
        };

        reader.readAsText(file);
    } else {
        alert('Please, select a JSON file');
    }
}
