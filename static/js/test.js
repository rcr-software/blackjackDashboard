var socket = io.connect('http://127.0.0.1:5000/data');

var options = {
    chart: {
        height: 350,
        type: 'radialBar',
        color: '#000000',
        startAngle: -143,
        endAngle: 114,
    },
    track: {
        show: true,
        colors: ['#f1b203'],
        background: '#000000',
        strokeWidth: '10%',
        opacity: 0.2,
        margin: 3,},
    series: [0],
    labels: ['Temperature'],
    fill: {
        type: 'gradient',
        gradient: {
          colors: ['#e8c21a', '#e8c21a'],
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      }
    };




var chart1 = new ApexCharts(document.querySelector('#chart1'), options);
var chart2 = new ApexCharts(document.querySelector('#chart2'), options);
var chart3 = new ApexCharts(document.querySelector('#chart3'), options);

chart1.render();
chart2.render();
chart3.render();

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
        chart1.updateSeries([datos],true);
        chart2.updateSeries([datos],true);
        chart3.updateSeries([datos],true);
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
