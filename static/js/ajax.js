document.addEventListener("DOMContentLoaded", function() {
  var options = {
    series: [67],
    chart: {
    height: 350,
    type: 'radialBar',
    offsetY: -10
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,  //LOAD DADA FROM LABJACK 135 + 2*VIN , JUST TO SHOW VISUALIZATion
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 120
        },
        value: {
          offsetY: 76,
          fontSize: '22px',
          color: undefined,
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
    },
  },
  stroke: {
    dashArray: 4
  },
  labels: ['Signal'],
  };

  var chart1 = new ApexCharts(document.querySelector("#chart1"), options);
  chart1.render();

  var chart2 = new ApexCharts(document.querySelector("#chart2"), options);
  chart2.render();

  var chart3 = new ApexCharts(document.querySelector("#chart3"), options);
  chart3.render();

  var chart4 = new ApexCharts(document.querySelector("#chart4"), options);
  chart4.render();

});



var paramValue = 1;

function pollServer() {

  // Make an AJAX request to the server
  $.ajax({
      url: '/get_update',
      type: 'GET',
      data: {param_name: paramValue},
      dataType: 'json',
      success: function (data) {
          // Update the UI with the received data
          $('#update-container').text('Update: ' + data.update);
          // Poll again after processing
          setTimeout(pollServer, 500); // Poll every 1 second
      },
      error: function (error) {
          console.error('Error during polling:', error);
          // Handle errors and retry
          setTimeout(pollServer, 500); // Retry every 1 second
      }
  });
};//End pollServer Function


pollServer();