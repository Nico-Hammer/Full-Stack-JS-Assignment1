google.charts.load('current',{packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
const data = google.visualization.arrayToDataTable([
  ['Contry', 'Mhl'],
  ['Italy', 55],
  ['France', 49],
  ['Spain', 44],
  ['USA', 24],
  ['Argentina', 15]
]);
const options = {
  title: 'World Wide Wine Production'
};
const chart = new google.visualization.PieChart(document.getElementById('myChart'));
chart.draw(data, options);
}