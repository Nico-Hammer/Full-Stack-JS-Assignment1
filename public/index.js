google.charts.load('current',{packages:['corechart']}); // load the google chart api
google.charts.setOnLoadCallback(() => { document.getElementById('myChart').style.display = "none"; }); // set the chart to hidden on page load using an arrow function
let chartTitle;
let chartType;
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
  };
  document.getElementById('myChart').style.display = "block"; // make the chart visible after data is submitted
  /*
  * check what type of chart the user selected and render accordingly
  */
  if(chartType === "Pie"){ chart = new google.visualization.PieChart(document.getElementById('myChart')); }
  else{ chart = new google.visualization.BarChart(document.getElementById('myChart')); }
  chart.draw(data, options);
}