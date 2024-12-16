document.getElementById('calculate-again').style.display = 'none';

document.getElementById('calculate').addEventListener('click', function() {
  // Get input values
  const nullHypothesis = parseFloat(document.getElementById('NULLHYPO').value); // Population mean (Null Hypothesis)
  const altHypothesis = parseFloat(document.getElementById('ALTHYPO').value); // Sample mean
  const stdDeviation = parseFloat(document.getElementById('std-deviation').value); // Standard Deviation
  const significanceLevel = parseFloat(document.getElementById('significance-level').value); // Significance level
  const tailType = document.getElementById('tail-type').value; // One-tailed or Two-tailed test
  
  // Check if all values are entered correctly
  if (isNaN(nullHypothesis) || isNaN(altHypothesis) || isNaN(stdDeviation) || isNaN(significanceLevel)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  // Calculate Z-Statistic
  const zStatistic = (altHypothesis - nullHypothesis) / stdDeviation;
  
  // Display the result
  document.getElementById('result').innerHTML = `Z-Statistic: ${zStatistic.toFixed(2)}`;
  
  // Show the result section
  document.querySelector('.answer').style.display = 'block';
});
