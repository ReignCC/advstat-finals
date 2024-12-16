document.getElementById('calculate-again').style.display = 'none';

document.getElementById('calculate').addEventListener('click', function() {
  // Get input values
  const NULLHYPO = parseFloat(document.getElementById('NULLHYPO').value);  // Population mean (H₀)
  const ALTHYPO = parseFloat(document.getElementById('ALTHYPO').value);  // Alternative hypothesis (H₁)
  const stdDeviation = parseFloat(document.getElementById('std-deviation').value);  // Standard deviation (σ)
  const X = parseFloat(document.getElementById('X').value);  // Sample mean (X̄)
  const N = parseFloat(document.getElementById('N').value);  // Sample size (n)
  const POPU = parseFloat(document.getElementById('population').value); // Population mean
  const alpha = parseFloat(document.getElementById('significance-level').value);  // Significance level (α)
  const tailType = document.getElementById('tail-type').value;  // Tail type

  // Z-Test Calculation
  const Z = (X - POPU) / (stdDeviation / Math.sqrt(N));

  // Get the Z value from the Z-table based on significance and tail type
  const tableZValue = getZValue(alpha, tailType);

  // Compare the calculated Z value and the critical Z value (from the Z-table)
  let resultMessage = '';
  let comparisonMessage = '';

  // Show whether the Z value is greater or less than the critical Z value
  if (Math.abs(Z) > tableZValue) {
    comparisonMessage = `The calculated Z value (${Z.toFixed(3)}) is greater than the critical Z value (${tableZValue}).`;
    resultMessage = 'Reject the Null Hypothesis (H₀)';
  } else {
    comparisonMessage = `The calculated Z value (${Z.toFixed(3)}) is less than the critical Z value (${tableZValue}).`;
    resultMessage = 'Fail to Reject the Null Hypothesis (H₀)';
  }

  // Display the results
  document.querySelector('.answer').style.display = 'block';
  document.getElementById('hypothesis-test').style.display = 'none';
  document.getElementById('hypothesisBTN').style.display = 'none';
  document.getElementById('calculate-again').style.display = 'block';
  
  // Display calculated Z, critical Z, comparison, and conclusion
  document.getElementById('result').innerHTML = `
    <h3>Z-Test Result:</h3>
    <p><strong>Calculated Z:</strong> ${Z.toFixed(3)}</p>
    <p><strong>Critical Z (from Z-table):</strong> ${tableZValue}</p>
    <p><strong>Comparison:</strong> ${comparisonMessage}</p>
    <p><strong>Conclusion:</strong> ${resultMessage}</p>
  `;
  
  // Plot the normal distribution curve with shaded regions
  plotNormalDistribution(Z, tableZValue, alpha, tailType);
});

function plotNormalDistribution(calculatedZ, criticalZ, alpha, tailType) {
  const ctx = document.getElementById('normalCurveCanvas').getContext('2d');

  // Clear any previous chart
  if (window.chart) {
    window.chart.destroy();
  }

  // Create the normal distribution curve
  window.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 100 }, (_, i) => (i - 50) / 10), // X values for the curve
      datasets: [{
        label: 'Normal Distribution Curve',
        data: Array.from({ length: 100 }, (_, i) => normalDist((i - 50) / 10)), // Y values for the curve
        borderColor: 'black',
        fill: false,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { 
          display: true, // Ensure the legend is displayed
        },
      },
      scales: {
        x: { beginAtZero: false },
        y: { beginAtZero: false, max: 0.5 }
      }
    }
  });

  // Define the rejection regions
  const rejectionRegionStart = criticalZ;
  const rejectionRegionEnd = (tailType === 'two-tailed' ? -criticalZ : Infinity);

  // Define the acceptance region (everything inside the critical values)
  const acceptanceRegionStart = (tailType === 'two-tailed' ? -criticalZ : -Infinity);
  const acceptanceRegionEnd = criticalZ;

  // Add shaded rejection region
  window.chart.data.datasets.push({
    label: 'Shaded Rejection Region',
    data: Array.from({ length: 100 }, (_, i) => {
      const xVal = (i - 50) / 10;
      if (xVal < rejectionRegionStart || (tailType === 'two-tailed' && xVal > rejectionRegionEnd)) {
        return normalDist(xVal);
      }
      return null;
    }),
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // Red color for rejection region
    borderColor: 'rgba(255, 0, 0, 0.2)',
    borderWidth: 0,
    fill: true
  });

  // Add shaded acceptance region
  window.chart.data.datasets.push({
    label: 'Shaded Acceptance Region',
    data: Array.from({ length: 100 }, (_, i) => {
      const xVal = (i - 50) / 10;
      if (xVal >= acceptanceRegionStart && xVal <= acceptanceRegionEnd) {
        return normalDist(xVal);
      }
      return null;
    }),
    backgroundColor: 'lime', // Green color for acceptance region
    borderColor: 'rgba(0, 255, 0, 0.2)',
    borderWidth: 0,
    fill: true
  });

  // Adding text annotations to indicate the colors directly on the graph
  window.chart.options.plugins.annotation = {
    annotations: [
      {
        type: 'text',
        x: acceptanceRegionStart,
        y: 0.4, // Adjust based on where you want the text to appear
        text: 'Acceptance Area (Green)',
        font: {
          size: 14,
          family: 'Arial',
          weight: 'bold'
        },
        color: 'green'
      },
      {
        type: 'text',
        x: rejectionRegionStart,
        y: 0.4, // Adjust as needed
        text: 'Rejection Area (Red)',
        font: {
          size: 14,
          family: 'Arial',
          weight: 'bold'
        },
        color: 'red'
      }
    ]
  };

  window.chart.update();
}




function normalDist(x) {
  // Standard normal distribution formula
  const exponent = Math.exp(-0.5 * x * x);
  return (1 / Math.sqrt(2 * Math.PI)) * exponent;
}

function getZValue(significanceLevel, tailType) {
  // Z-table for two-tailed and one-tailed significance levels
  var zTable = {
      "two-tailed": {
          0.2: 1.28,
          0.15: 1.44,
          0.1: 1.645,
          0.05: 1.96,
          0.02: 2.33,
          0.01: 2.575
      },
      "one-tailed": {
          0.2: 0.842,
          0.15: 0.994,
          0.1: 1.28,
          0.05: 1.645,
          0.02: 1.96,
          0.01: 2.33
      }
  };

  // Check if the selected significance level and tail type exist in the table
  if (zTable[tailType] && zTable[tailType][significanceLevel] !== undefined) {
      return zTable[tailType][significanceLevel];
  } else {
      return "Invalid selection"; // Return error if there's no match
  }
}
