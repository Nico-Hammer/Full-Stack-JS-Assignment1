google.charts.load('current', { packages: ['corechart'] }); // load Google Charts
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
const body = document.getElementById('body')
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
    labelInput.required = true;
    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.id = `value${i}`;
    valueInput.placeholder = `Value for section ${i}`;
    valueInput.min = 0; // section value must be above 0
    valueInput.max = 400; // section value must be <= 400
    valueInput.required = true;
    /*
    * add the labels and input sections for the number of sections specified
    * if the chart is a pie chart hide the input box for the final section
    */
    if(chartType == 'Pie' && i == count){
    sectionInputsDiv.appendChild(labelInput);
    sectionInputsDiv.appendChild(valueInput);
    valueInput.style.display = "none";
    valueInput.required = false;
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
  let maxVal;
  const dataArray = [];
  /*
  * if the chart is a pie chart then go through and add each label and value to the dataArray
  * since the pie chart does not get the last value from the user we are adding all the values
  * together then subtracting that from the user specified total value to get the value
  */
  if (chartType === "Pie") { 
    let sum = 0;
    dataArray.push(['Label', 'Value']);
    for (let i = 1; i <= chartSectionCount; i++) {
      const label = document.getElementById(`label${i}`).value;
      if (i < chartSectionCount) {
        const value = parseFloat(document.getElementById(`value${i}`).value);
        sum += value;
        dataArray.push([label, value]);
      } 
    }
    const lastValue = pieTotal - sum; // calculate the value for the final section
    document.getElementById(`value${chartSectionCount}`).value = lastValue; // set the final value
    const lastLabel = document.getElementById(`label${chartSectionCount}`).value = document.getElementById(`label${chartSectionCount}`).value; // set the final label
    dataArray.push([lastLabel, lastValue]); // add final values to the data array
    chart = new google.visualization.PieChart(document.getElementById('myChart')); // create the chart 
  }
  /*
  * this is for the column chart
  */
  else {
    dataArray.push(['Label', 'Value', { role: 'style' }, {role: 'annotation'}]); // add the header values and style options to the dataArray
    const colors = []; // create an array to store the random colours
    /*
    * create the same amount of random colours as there are sections
    */
    for (let i = 1; i <= chartSectionCount; i++) {
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    /*
    * get the labels and values for each section and add it to the dataArray
    * we are also getting the maximum value in the data entered for later
    */
    for (let i = 1; i <= chartSectionCount; i++) {
      const label = document.getElementById(`label${i}`).value;
      let value = parseFloat(document.getElementById(`value${i}`).value);
      dataArray.push([label, value, colors[i],value]);
      if(value > maxVal){
        maxVal = value;
      }
    }
    chart = new google.visualization.ColumnChart(document.getElementById('myChart')); // create the chart
  }
  const data = google.visualization.arrayToDataTable(dataArray); // store the data in a way that the API can read
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
        interval: [1, gridInt/2,gridInt/2.5, gridInt] // set the multiples of the user input gridline that the gridlines can be on
      },
      viewWindow: {
        min: 0, // cant go below 0 on the graph display
        max: maxVal / gridInt * gridInt // normalize the gridline values and display height based on the maximum data value gotten above
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
  document.body.appendChild(document.getElementById('myChart')); // make sure the chart is outside of any forms after DOM manipulation above
  document.getElementById('myChart').style.display = "block"; // stop hiding the div that shows the chart
  chart.draw(data, options); // render chart to screen using the view created above to show values on top of columns
}