import React from 'react'
import StatisticLine from './StatisticLine';

const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="total feedback" value={total} />
          <StatisticLine text="average score" value={average} />
          <StatisticLine text="positive feedback" value={`${positivePercentage}%`}/>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;