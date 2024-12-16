document.getElementById('calculate-again').style.display = 'none';

document.getElementById('calculate').addEventListener('click', function () {
  let xValues = document.getElementById('xvalues').value.split(',').map(Number);
  let yValues = document.getElementById('yvalues').value.split(',').map(Number);
  
  if (xValues.length !== yValues.length || xValues.length < 2) {
    alert('Please ensure both x and y values have the same length and are greater than 1.');
    return;
  }

  // Calculate the sum of x, y, x^2, and xy for regression
  let n = xValues.length;
  let sumX = xValues.reduce((a, b) => a + b, 0);
  let sumY = yValues.reduce((a, b) => a + b, 0);
  let sumXY = xValues.reduce((sum, x, idx) => sum + (x * yValues[idx]), 0);
  let sumX2 = xValues.reduce((sum, x) => sum + (x * x), 0);

  // Calculate the slope (B) and y-intercept (A) for the regression equation Y = A + Bx
  let B = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  let A = (sumY - B * sumX) / n;

  // Calculate the correlation coefficient (r)
  let sumY2 = yValues.reduce((sum, y) => sum + (y * y), 0);
  let r = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  // Display the results
  document.getElementById('result').innerHTML = ` 
    <strong>Regression Equation:</strong> Y = ${A.toFixed(2)} + ${B.toFixed(2)}x <br>
    <strong>Correlation Coefficient (r):</strong> ${r.toFixed(2)}<br>
    <strong>Relationship:</strong> ${getCorrelationInterpretation(r)}
  `;

  // Show the answer div
  document.querySelector('.answer').style.display = 'block';
  document.getElementById('simple-linear-regression').style.display = 'none';
  document.getElementById('hypothesisBTN').style.display = 'none';
  document.getElementById('calculate-again').style.display = 'block';

  // Plot the scatter diagram with the regression line
  plotScatter(xValues, yValues, A, B);
});

document.getElementById('calculate-again').addEventListener('click', function () {
  document.querySelector('.answer').style.display = 'none';
  document.getElementById('simple-linear-regression').style.display = 'block';
  document.getElementById('hypothesisBTN').style.display = 'block';
  document.getElementById('calculate-again').style.display = 'none';
});

// Function to plot scatter diagram and regression line
function plotScatter(xValues, yValues, A, B) {
  const ctx = document.getElementById('scatterPlot').getContext('2d');

  // Generate y-values for the regression line using Y = A + Bx
  let regressionLine = xValues.map(x => ({ x: x, y: A + B * x }));

  // If there is an existing chart, destroy it before creating a new one
  if (window.scatterChart) {
    window.scatterChart.destroy();
  }

  // Create the scatter plot with regression line
  window.scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Data Points',
        data: xValues.map((x, idx) => ({ x: x, y: yValues[idx] })),
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }, {
        label: 'Regression Line',
        data: regressionLine,
        type: 'line',
        borderColor: 'red',
        borderWidth: 2,
        fill: false,  // Do not fill the area under the line
        tension: 0.1  // Smoothing factor for the line
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { 
          title: { 
            display: true, 
            text: 'X values' 
          } 
        },
        y: { 
          title: { 
            display: true, 
            text: 'Y values' 
          } 
        }
      }
    }
  });
}

// Function to interpret the correlation coefficient (r)
function getCorrelationInterpretation(r) {
  let interpretation = '';
  
  // Check if the correlation is positive or negative and determine the strength
  if (r >= 0.90) {
    return 'Very high positive correlation';
  } else if (r >= 0.70) {
    return 'High positive correlation';
  } else if (r >= 0.50) {
    return 'Moderate positive correlation';
  } else if (r >= 0.30) {
    return 'Low positive correlation';
  } else if (r > 0) {
    return 'Negligible positive correlation';
  } else if (r <= -0.90) {
    return 'Very high negative correlation';
  } else if (r <= -0.70) {
    return 'High negative correlation';
  } else if (r <= -0.50) {
    return 'Moderate negative correlation';
  } else if (r <= -0.30) {
    return 'Low negative correlation';
  } else {
    return 'Negligible negative correlation';
  }

}



