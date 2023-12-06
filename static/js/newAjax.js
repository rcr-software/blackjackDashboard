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


var chart1 = new ApexCharts(document.querySelector("#chart1"), options);
chart1.render();

var val=1;
function renderingProcess() {   
    options.plotOptions.endAngle=135;
    options.labels=['Temperature  tank 1'];
    options.series=[val]
    
    val=val+1;
};


window.setInterval(renderingProcess,1000);


