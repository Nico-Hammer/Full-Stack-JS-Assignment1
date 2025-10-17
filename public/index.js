google.charts.load('current',{packages:['corechart']}); // load the google chart api
google.charts.setOnLoadCallback(() => { document.getElementById('myChart').style.display = "none"; }); // set the chart to hidden on page load using an arrow function
let chartTitle;
let chartType;
let chartSectionCount;
let yAxisTitle;
let xAxisTitle;
let gridInt;
const firstForm = document.getElementById("chartForm"); // get the form
/*
* event listener for the submit button
* this sets the chart data to the data the user entered in the form
* then calls the chart drawing function
*/
firstForm.addEventListener('submit',(e) => {
  e.preventDefault();
  chartTitle = firstForm.elements.title.value;
  chartType = firstForm.elements.chartType.value;
  chartSectionCount = firstForm.elements.sectionCount.value;
  formRender();
});

/*
* function to render the proper chart form and inject the form stuff for the labels and inputs
* of each section/bar
*/
function formRender(){
  let formToRender;
  firstForm.style.display = "none"; // hide the first form after submitting it
  if(chartType === "Pie"){
    formToRender = document.getElementById("pieForm");
    formToRender.style.display = "block";
    formToRender.addEventListener('submit',(e) =>{
      e.preventDefault();
      drawChart();
    })
  }
  else{
    formToRender = document.getElementById("columnForm");
    formToRender.style.display = "block";
    formToRender.addEventListener('submit',(e) =>{
      e.preventDefault();
      yAxisTitle = formToRender.elements.yTitle.value;
      xAxisTitle = formToRender.elements.xTitle.value;
      gridInt = formToRender.elements.gridInter.value;
      drawChart();
    })
  }
}
/*
* function to draw the chart using the google charts api
*/
function drawChart() {
  let chart;
  console.log(gridInt);
  const data = google.visualization.arrayToDataTable([
    ['Contry', 'Mhl'],
    ['Italy', 55],
    ['France', 49],
    ['Spain', 44],
    ['USA', 24],
    ['Argentina', 15]
  ]);
  /* 
  * chart options (currently only setting the title)
  */
  const options = {
    title: chartTitle,
    hAxis: {
      title: xAxisTitle,
      textStyle: {
        fontSize: 14,
        color: '#000000',
        bold: true,
        italic: false
      },
      titleTextStyle: {
        fontSize: 18,
        color: '#000000',
        bold: true,
        italic: false
      }
    },
    vAxis: {
      title: yAxisTitle,
      gridlines: {
        interval: [1,gridInt/2,gridInt/2.5,gridInt],
      },
      viewWindow: {
        min: 0,
        max: 60 / gridInt * gridInt
      },
      textStyle: {
        fontSize: 18,
        color: '#000000',
        bold: false,
        italic: false
      },
      titleTextStyle: {
        fontSize: 18,
        color: '#000000',
        bold: true,
        italic: false
      }
    }
  };
  document.getElementById('myChart').style.display = "block"; // make the chart visible after data is submitted
  /*
  * check what type of chart the user selected and render accordingly
  */
  if(chartType === "Pie"){ chart = new google.visualization.PieChart(document.getElementById('myChart')); }
  else{ chart = new google.visualization.ColumnChart(document.getElementById('myChart')); }
  chart.draw(data, options);
}