google.charts.load('current', { packages: ['corechart'] }); // load Google Charts
google.charts.setOnLoadCallback(() => {
  document.getElementById('myChart').style.display = "none"; // hide chart initially
});

let chartTitle;
let chartType;
let chartSectionCount;
let yAxisTitle;
let xAxisTitle;
let gridInt;

const firstForm = document.getElementById("chartForm"); 
const sectionCountInput = document.getElementById('sectionCount');
const sectionInputsDiv = document.getElementById('sectionInputs');
const pieForm = document.getElementById("pieForm");
const columnForm = document.getElementById("columnForm");

/*
* dynamically create section/bar inputs based on number of sections
*/
sectionCountInput.addEventListener('input', () => {
  const count = parseInt(sectionCountInput.value) || 0;
  sectionInputsDiv.innerHTML = '';

  if (count < 2 || count > 6) return;

  for (let i = 1; i <= count; i++) {
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.id = `label${i}`;
    labelInput.placeholder = `Label for section ${i}`;

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.id = `value${i}`;
    valueInput.placeholder = `Value for section ${i}`;

    // hide value input for last pie sector
    if (i === count && chartType === 'Pie') {
      valueInput.style.display = 'none';
    }

    sectionInputsDiv.appendChild(labelInput);
    sectionInputsDiv.appendChild(valueInput);
    sectionInputsDiv.appendChild(document.createElement('br'));
  }
});

/*
* main form submit listener
*/
firstForm.addEventListener('submit', (e) => {
  e.preventDefault();
  chartTitle = firstForm.elements.title.value;
  chartType = firstForm.elements.chartType.value;
  chartSectionCount = parseInt(firstForm.elements.sectionCount.value);

  firstForm.style.display = "none";

  if (chartType === "Pie") {
    pieForm.style.display = "block";
  } else {
    columnForm.style.display = "block";
  }
});

/*
* pie form submit listener
*/
pieForm.addEventListener('submit', (e) => {
  e.preventDefault();
  drawChart();
});

/*
* column form submit listener
*/
columnForm.addEventListener('submit', (e) => {
  e.preventDefault();
  yAxisTitle = columnForm.elements.yTitle.value;
  xAxisTitle = columnForm.elements.xTitle.value;
  gridInt = parseInt(columnForm.elements.gridInter.value) || 10;
  drawChart();
});

/*
* function to draw the chart
*/
function drawChart() {
  let chart;
  const dataArray = [];

  if (chartType === "Pie") {
    const totalValue = parseFloat(document.getElementById('totalValue').value) || 100;
    let sum = 0;
    dataArray.push(['Label', 'Value']);

    for (let i = 1; i <= chartSectionCount; i++) {
      const label = document.getElementById(`label${i}`).value || `Sector ${i}`;
      if (i < chartSectionCount) {
        const value = parseFloat(document.getElementById(`value${i}`).value) || 0;
        sum += value;
        dataArray.push([label, value]);
      } else {
        const lastValue = totalValue - sum;
        dataArray.push([label, lastValue]);
      }
    }

    chart = new google.visualization.PieChart(document.getElementById('myChart'));

  } else { // Column chart
    dataArray.push(['Label', 'Value', { role: 'style' }]);
    const colors = [];
    for (let i = 0; i < chartSectionCount; i++) {
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }

    for (let i = 1; i <= chartSectionCount; i++) {
      const label = document.getElementById(`label${i}`).value || `Bar ${i}`;
      let value = parseFloat(document.getElementById(`value${i}`).value) || 0;
      if (value > 400) value = 400; // max restriction
      dataArray.push([label, value, colors[i - 1]]);
    }

    chart = new google.visualization.ColumnChart(document.getElementById('myChart'));
  }

  const data = google.visualization.arrayToDataTable(dataArray);

    var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
    { calc: "stringify",
      sourceColumn: 1,
      type: "string",
      role: "annotation" },
    2]);

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

  document.getElementById('myChart').style.display = "block";
  chart.draw(view, options);
}
