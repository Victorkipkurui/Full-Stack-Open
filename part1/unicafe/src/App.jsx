import { useState } from 'react'
import Header from './Header'
import Button from './Button';
import Statistics from './Statistics';

const App = () => {
  
  const title = 'give feedback';

  const stats = 'statistics';

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positivePercentage, setPositivePercentage] = useState(0);


  const handlegoodClick = () => {
    setAll(allClicks.concat('G'));
    const updatedGoods = (good + 1);
    setGood(updatedGoods);
    const updatedTotal = (updatedGoods + neutral + bad);
    setTotal(updatedTotal);
    const average = (updatedGoods - bad) / total;
    setAverage(average);
    const positivePercentage = (good / total) * 100;
    setPositivePercentage(positivePercentage);
  }
 
  const handleneutralClick = () => {
    setAll(allClicks.concat('N'));
    const updatedNeutral = (neutral + 1);
    setNeutral(updatedNeutral);
    const updatedTotal = (updatedNeutral + good + bad);
    setTotal(updatedTotal);
    const average = (good - bad) / total;
    setAverage(average);
    const positivePercentage = (good / total) * 100;
    setPositivePercentage(positivePercentage);
  }

  const handlebadClick = () => {
    setAll(allClicks.concat('B'));
    const updatedBad = (bad + 1);
    setBad(updatedBad);
    const updatedTotal = (updatedBad + good + bad);
    setTotal(updatedTotal);
    const average = (good - bad) / total;
    setAverage(average);
    const positivePercentage = (good / total) * 100;
    setPositivePercentage(positivePercentage);
  
  }
  return (
    <div>
      <Header title={title}></Header>
      <Button onClick={handlebadClick} text="bad"></Button> 
      <Button onClick={handlegoodClick} text="good"></Button>
      <Button onClick={handleneutralClick} text="neutral"></Button>
      <Header stats={stats}></Header>
      {total > 0 ? (
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positivePercentage={positivePercentage} />
      ) : (
      <p>No feedback given</p>
      )}
    </div>
  )
}

export default App