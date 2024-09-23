import React from 'react'

const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  return (
    <div>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>Total Feedback: {total}</p>
      <p>Average Score: {average.toFixed(2)}</p>
      <p>Positive Feedback: {positivePercentage.toFixed(2)}%</p>
    </div>
  );
};

export default Statistics;