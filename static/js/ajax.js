
//apex windows style
window.Apex = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false
    },
  },
  colors: ['#FCCF31', '#17ead9', '#f02fc2'],
  stroke: {
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    borderColor: "#40475D",
  },
  xaxis: {
    axisTicks: {
      color: '#333'
    },
    axisBorder: {
      color: "#333"
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      gradientToColors: ['#F55555', '#6078ea', '#6094ea']
    },
  },
  tooltip: {
    theme: 'dark',
    x: {
      formatter: function (val) {
        return moment(new Date(val)).format("HH:mm:ss")
      }
    }
  },
  yaxis: {
    decimalsInFloat: 2,
    opposite: true,
    labels: {
      offsetX: -10
    }
  }
};

//options for chart1
var options = {
  series: [50],//Value to LOAD DADA FROM LABJACK 135 + 2*VIN , JUST TO SHOW VISUALIZATion
  chart: {
  height: 350,
  type: 'radialBar',
  offsetY: -10
},
plotOptions: {
  radialBar: {
    startAngle: -135,
    endAngle: 135,  
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
labels: ['Temperature'],
};

//options for Circle chart
var optionsCircle = {
  chart: {
    type: 'radialBar',
    height: 320,
    offsetY: -30,
    offsetX: 20
  },
  plotOptions: {
    radialBar: {
      size: undefined,
      inverseOrder: false,
      hollow: {
        margin: 5,
        size: '48%',
        background: 'transparent',
      },
      track: {
        show: true,
        background: '#40475D',
        strokeWidth: '10%',
        opacity: 1,
        margin: 3, // margin is in pixels
      },


    },
  },
  series: [71, 63],
  labels: ['Device 1', 'Device 2'],
  legend: {
    show: true,
    position: 'left',
    offsetX: -30,
    offsetY: 10,
    formatter: function (val, opts) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex] + '%'
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  }
}



//document.addEventListener("DOMContentLoaded", function() {
 
  options.plotOptions.endAngle=135;
  options.labels=['Temperature  tank 1'];
  options.series=[90]
  var chart1 = new ApexCharts(document.querySelector("#chart1"), options);
  chart1.render()
  
  options.plotOptions.endAngle=100;
  options.labels=['Pressure Tank 1'];
  options.series=[30]
  var chart2 = new ApexCharts(document.querySelector("#chart2"), options);
 // chart2.render();

  options.plotOptions.endAngle=200;
  options.labels=['Temperature Tank 2'];
  options.series=[32]
  var chart3 = new ApexCharts(document.querySelector("#chart3"), options);
 // chart3.render();
  
  options.plotOptions.endAngle=250;
  options.labels=['Pressure Tank 2'];
  options.series=[45]
  var chart4 = new ApexCharts(document.querySelector("#chart4"), options);
 // chart4.render();

//});



var paramValue = 1;

// function pollServer() {

//   // Make an AJAX request to the server
//   $.ajax({
//       url: '/get_update',
//       type: 'GET',
//       data: {param_name: paramValue},
//       dataType: 'json',
//       success: function (data) {
//           // Update the UI with the received data
//           $('#update-container').text('Update: ' + data.update);
//           //chart1.updateSeries(data.update,data.update);

//           // Poll again after processing
//           setTimeout(pollServer, 500); // Poll every 1 second
//       },
//       error: function (error) {
//           console.error('Error during polling:', error);
//           // Handle errors and retry
//           setTimeout(pollServer, 500); // Retry every 1 second
//       }
//   });
// };//End pollServer Function


// pollServer();


function getFromLabJ(){

  $.ajax({
    url: '/get_update',
    type: 'GET',
    data: {param_name: paramValue},
    dataType: 'json',
    success: function (data) {
        // Update the UI with the received data
        return data.update;
        //$('#update-container').text('Update: ' + data.update);
        
        //chart1.Series=[data.update,data.update];
        // Poll again after processing
        //setTimeout(pollServer, 500); // Poll every 1 second
    },
    error: function (error) {
        console.error('Error during polling:', error);
        // Handle errors and retry
        //setTimeout(pollServer, 500); // Retry every 1 second
    }
});

};

 

function updateCircle(){

//   $.ajax({
//     url: '/get_update',
//     type: 'GET',
//     data: {param_name: paramValue},
//     dataType: 'json',
//     success: function (data) {
//         // Update the UI with the received data
//         $('#update-container').text('Update: ' + data.update);
        
//         chart1.Series=[data.update,data.update];
//         // Poll again after processing
//         //setTimeout(pollServer, 500); // Poll every 1 second
//     },
//     error: function (error) {
//         console.error('Error during polling:', error);
//         // Handle errors and retry
//         //setTimeout(pollServer, 500); // Retry every 1 second
//     }
// });
//getFromLabJ()
chart1.Series=[getFromLabJ(),getFromLabJ()];
  
};

window.setInterval(updateCircle,1000);