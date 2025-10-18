google.charts.load('current', { packages: ['corechart'] }); // load Google Charts
google.charts.setOnLoadCallback(() => {
  document.getElementById('myChart').style.display = "none"; // hide chart initially
});
/* 
* initialize variables that store chart information but not data to put in the chart
*/
let chartTitle;
let chartType;
let chartSectionCount;
let yAxisTitle;
let xAxisTitle;
let gridInt;
let pieTotal;
/*
* initialize variables to make it easier to work with the forms
*/
const firstForm = document.getElementById("chartForm"); 
const sectionCountInput = document.getElementById('sectionCount');
const sectionInputsDiv = document.getElementById('sectionInputs');
const pieForm = document.getElementById("pieForm");
const columnForm = document.getElementById("columnForm");
/*
* main form submit listener that gets the chart title and the labels + data for each section from the user
* then displays the right chart form
*/
firstForm.addEventListener('submit', (e) => {
  e.preventDefault();
  chartTitle = firstForm.elements.title.value;
  chartSectionCount = parseInt(firstForm.elements.sectionCount.value);
  firstForm.style.display = "none";
  /*
  * show the proper chart depending on chart type selected by user
  */
  if (chartType === "Pie") { pieForm.style.display = "block"; } 
  else { columnForm.style.display = "block"; }
});
/*
* dynamically create section/bar inputs based on number of sections entered by the user
*/
sectionCountInput.addEventListener('input', () => {
  chartType = firstForm.elements.chartType.value; // set the chart type everytime the number of sections is changed
  const count = sectionCountInput.value; // store the number of sections
  sectionInputsDiv.innerHTML = '';
  /*
  * for loop that creates each label + input for the form after getting the number of sections from the user
  * then setting the properties so that they work properly
  */
  for (let i = 1; i <= count; i++) {
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.id = `label${i}`;
    labelInput.placeholder = `Label for section ${i}`;
    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.id = `value${i}`;
    valueInput.placeholder = `Value for section ${i}`;
    valueInput.min = 0; // section value must be above 0
    valueInput.max = 400; // section value must be <= 400
    /*
    * add the labels and input sections for the number of sections specified
    * if the chart is a pie chart dont make an input box for the final section
    */
    if(chartType == 'Pie' && i == count){
    sectionInputsDiv.appendChild(labelInput);
    sectionInputsDiv.appendChild(document.createElement('br'));
    }
    else{
    sectionInputsDiv.appendChild(labelInput);
    sectionInputsDiv.appendChild(valueInput);
    sectionInputsDiv.appendChild(document.createElement('br'));
    }
  }
});
/*
* pie form submit listener that gets the total value from the user then calls the chart drawing function
* 
*/
pieForm.addEventListener('submit', (e) => {
  e.preventDefault();
  pieTotal = pieForm.elements.totalValue.value;
  drawChart();
});
/*
* column form submit listener that gets the axis titles and gridline interval from the user then call the chart drawing function
*/
columnForm.addEventListener('submit', (e) => {
  e.preventDefault();
  yAxisTitle = columnForm.elements.yTitle.value;
  xAxisTitle = columnForm.elements.xTitle.value;
  gridInt = columnForm.elements.gridInter.value;
  drawChart();
});
/*
* function to draw the chart
*/
function drawChart() {
  let chart;
  let label;
  const dataArray = [];
  /*
  * if the chart is a pie chart then go through the data and add all the values together before subtracting that
  * from the total value entered by the user to get the final section value
  */
  if (chartType === "Pie") {
    pieTotal = document.getElementById('totalValue').value;
    let sum = 0;
    dataArray.push(['Label', 'Value']);
    for (let i = 1; i <= chartSectionCount; i++) {
      label = document.getElementById(`label${i}`).value || `Sector ${i}`;
      if (i < chartSectionCount) {
        let value = document.getElementById(`value${i}`).value;
        sum += value;
        dataArray.push([label, value]);
      } 
    }
    const lastValue = pieTotal - sum;
    dataArray.push([label, lastValue]);
    chart = new google.visualization.PieChart(document.getElementById('myChart')); // create the chart 
  }
  else {
    dataArray.push(['Label', 'Value', { role: 'style' }]);
    const colors = []; // create an array to store the column colours
    for (let i = 1; i <= chartSectionCount; i++) {
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16)); // add a random colour to the array
      const label = document.getElementById(`label${i}`).value || `Bar ${i}`;
      let value = document.getElementById(`value${i}`).value;
      dataArray.push([label, value, colors[i]]); // add the label + data to the dataArray including the random colour for the columns
    }
    chart = new google.visualization.ColumnChart(document.getElementById('myChart')); // create the chart
  }
  const data = google.visualization.arrayToDataTable(dataArray); // store the data in a way that the API can read
  var view = new google.visualization.DataView(data); // create the data view for the chart data
  /*
  * take the data values from the chart data array and then turn those into strings for each column
  * after that, make them annotations so that they show above the respective columns
  */
  view.setColumns([0, 1,
    { calc: "stringify",
      sourceColumn: 1,
      type: "string",
      role: "annotation" },
    2]);
  /*
  * setting the styling options for the chart titles and gridlines
  * also setting the styling options for the data labels
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
        interval: [1, gridInt/2,gridInt/2.5, gridInt]
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
  document.getElementById('myChart').style.display = "block"; // stop hiding the div that shows the chart
  chart.draw(view, options); // render chart to screen using the view created above to show values on top of columns
}