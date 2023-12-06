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

var trigoStrength = 3
var iteration = 11



var paramValue=1;

function getRangeRandom() {
    var value=0;
    $.ajax({
      url: '/get_update',
      type: 'GET',
      data: {param_name: paramValue},
      dataType: 'json',
      success: function (data) {
          // Update the UI with the received data
          console.log(data.update);
          value = data.update;
          return value
        
      },
      error: function (error) {
          console.error('Error during polling:', error);
          value= 0;
          // Handle errors and retry
          //setTimeout(pollServer, 500); // Retry every 1 second
      }
    });
    
    console.log(value);
    return value//Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
}



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

var chartCircle = new ApexCharts(document.querySelector('#circlechart'), optionsCircle);
chartCircle.render();


var socket = io.connect('http://127.0.0.1:5000/data');

socket.on('update', function (data) {
  //var newDataPoint = { x: new Date().getTime(), y: data.data };
  chartCircle.updateSeries([data.data,data.data+20]);
  console.log(data.data);
});