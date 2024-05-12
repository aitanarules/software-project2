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

        const uniqueTimestamps = [...new Set(jsonData.map(item => item.timestamp))]; // Get unique timestamps

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

            // Fucntion to scale data
            function scaleData(values) {
                const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
                const stdDev = Math.sqrt(values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / values.length);
                return values.map(val => (val - mean) / stdDev);
            }

            // Escalar los datos
            const airgapValuesScaled = scaleData(airgapValues);
            const speedValuesScaled = scaleData(speedValues);
            const currentValuesScaled = scaleData(currentValues);
            const voltageValuesScaled = scaleData(voltageValues);

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

            Plotly.newPlot(plot, data, layout);
        };
        
        reader.readAsText(file);
    } else {
        alert('Please, select a JSON file');
    }
}




function showFileContentBubble() {
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

        const timestamps = jsonData.map(item => timestampToDate(item.timestamp));
        const airgapValues = extractValues(jsonData, 'airgap');
        const speedValues = extractValues(jsonData, 'speed');
        const currentValues = extractValues(jsonData, 'current');
        const voltageValues = extractValues(jsonData, 'voltage');

        const bubbleSize = 10; // Adjust this value to control the size of bubbles

        const trace1 = {
            x: timestamps,
            y: airgapValues,
            mode: 'markers',
            marker: {
                size: Array(airgapValues.length).fill(bubbleSize),
                color: '#17BECF',
                opacity: 0.5
            },
            text: timestamps.map((time, index) => `Airgap: ${airgapValues[index]}`)
        };

        const trace2 = {
            x: timestamps,
            y: speedValues,
            mode: 'markers',
            marker: {
                size: Array(speedValues.length).fill(bubbleSize),
                color: '#FF5733',
                opacity: 0.5
            },
            text: timestamps.map((time, index) => `Speed: ${speedValues[index]}`)
        };

        const trace3 = {
            x: timestamps,
            y: currentValues,
            mode: 'markers',
            marker: {
                size: Array(currentValues.length).fill(bubbleSize),
                color: '#FFFF00',
                opacity: 0.5
            },
            text: timestamps.map((time, index) => `Current: ${currentValues[index]}`)
        };

        const trace4 = {
            x: timestamps,
            y: voltageValues,
            mode: 'markers',
            marker: {
                size: Array(voltageValues.length).fill(bubbleSize),
                color: '#4CAF50',
                opacity: 0.5
            },
            text: timestamps.map((time, index) => `Voltage: ${voltageValues[index]}`)
        };

        const data = [trace1, trace2, trace3, trace4];
        const layout = {
            title: 'Historical Data (Bubble Chart)',
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


function showFileContentBubble2() {
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

        const uniqueTimestamps = [...new Set(jsonData.map(item => item.timestamp))]; // Get unique timestamps

        const airgapValues = extractValues(jsonData, 'airgap');
        const speedValues = extractValues(jsonData, 'speed');
        const currentValues = extractValues(jsonData, 'current');
        const voltageValues = extractValues(jsonData, 'voltage');

        const bubbleSize = 10; // Adjust this value to control the size of bubbles

        const trace1 = {
            x: uniqueTimestamps.map(timestampToDate),
            y: airgapValues,
            mode: 'markers',
            marker: {
                size: Array(uniqueTimestamps.length).fill(bubbleSize),
                color: '#17BECF',
                opacity: 0.5
            },
            text: uniqueTimestamps.map(timestamp => `Airgap: ${extractValues(jsonData.filter(item => item.timestamp === timestamp), 'airgap')[0]}`)
        };

        const trace2 = {
            x: uniqueTimestamps.map(timestampToDate),
            y: speedValues,
            mode: 'markers',
            marker: {
                size: Array(uniqueTimestamps.length).fill(bubbleSize),
                color: '#FF5733',
                opacity: 0.5
            },
            text: uniqueTimestamps.map(timestamp => `Speed: ${extractValues(jsonData.filter(item => item.timestamp === timestamp), 'speed')[0]}`)
        };

        const trace3 = {
            x: uniqueTimestamps.map(timestampToDate),
            y: currentValues,
            mode: 'markers',
            marker: {
                size: Array(uniqueTimestamps.length).fill(bubbleSize),
                color: '#FFFF00',
                opacity: 0.5
            },
            text: uniqueTimestamps.map(timestamp => `Current: ${extractValues(jsonData.filter(item => item.timestamp === timestamp), 'current')[0]}`)
        };

        const trace4 = {
            x: uniqueTimestamps.map(timestampToDate),
            y: voltageValues,
            mode: 'markers',
            marker: {
                size: Array(uniqueTimestamps.length).fill(bubbleSize),
                color: '#4CAF50',
                opacity: 0.5
            },
            text: uniqueTimestamps.map(timestamp => `Voltage: ${extractValues(jsonData.filter(item => item.timestamp === timestamp), 'voltage')[0]}`)
        };

        const data = [trace1, trace2, trace3, trace4];
        const layout = {
            title: 'Historical Data (Bubble Chart)',
            xaxis: {
                title: 'Date',
                tickmode: 'array',
                tickvals: uniqueTimestamps.map(timestampToDate),
                ticktext: uniqueTimestamps.map(timestamp => timestampToDate(timestamp).toLocaleString()) // Convert timestamps to readable date strings
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
