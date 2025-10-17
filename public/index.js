google.charts.load('current',{packages:['corechart']}); // load the google chart api
google.charts.setOnLoadCallback(() => { document.getElementById('myChart').style.display = "none"; }); // set the chart to hidden on page load using an arrow function
let chartTitle;
let chartType;
let chartSectionCount;
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
  drawChart();
});
/*
* function to draw the chart using the google charts api
*/
function drawChart() {
  let chart;
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
      title: 'Time of Day',
      viewWindow: {
        min: [7, 30, 0],
        max: [17, 30, 0]
      },
      textStyle: {
        fontSize: 14,
        color: '#ffffff',
        bold: true,
        italic: false
      },
      titleTextStyle: {
        fontSize: 18,
        color: '#ffffff',
        bold: true,
        italic: false
      }
    },
    vAxis: {
      title: 'Rating (scale of 1-10)',
      textStyle: {
        fontSize: 18,
        color: '#ffffff',
        bold: false,
        italic: false
      },
      titleTextStyle: {
        fontSize: 18,
        color: '#ffffff',
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