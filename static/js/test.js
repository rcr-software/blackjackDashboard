var socket = io.connect('http://127.0.0.1:5000/data');

var options = {
    chart: {
        height: 350,
        type: 'radialBar',
    },
    series: [70],
    labels: ['Progress'],
    };

var chart = new ApexCharts(document.querySelector('#chart'), options);
chart.render();

var paramValue =1;
var datos =0;

function pollServer() {
    $.ajax({
    url: '/get_update',
    type: 'GET',
    data: {param_name: paramValue},
    dataType: 'json',
    success: function (data) {
        // Update the UI with the received data
        console.log(data.update);
        value = data.update;
        datos=value;
        console.log(datos);
        chart.updateSeries([datos],true);
        //return value
        setTimeout(pollServer, 500);
        
    },
    error: function (error) {
        console.error('Error during polling:', error);
        value= 0;
        // Handle errors and retry
        setTimeout(pollServer, 500); // Retry every 1 second
        }
    });
}

pollServer();
