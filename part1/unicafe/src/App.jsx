import { useState } from 'react'
import Header from './Header'
import Button from './Button';
import Statistics from './Statistics';
import './App.css';


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
    updateStatistics(updatedGoods, neutral, bad);
  }
 
  const handleneutralClick = () => {
    setAll(allClicks.concat('N'));
    const updatedNeutral = (neutral + 1);
    setNeutral(updatedNeutral);
    updateStatistics(good, updatedNeutral, bad);
  }

  const handlebadClick = () => {
    setAll(allClicks.concat('B'));
    const updatedBad = (bad + 1);
    setBad(updatedBad);
    updateStatistics(updatedBad, neutral, good);
  
  }
  const updateStatistics = (good, neutral, bad) => {
    const updatedTotal = good + neutral + bad;
    setTotal(updatedTotal);

    const average = updatedTotal > 0 ? (good - bad) / updatedTotal : 0;
    setAverage(average);

    const positivePercentage = updatedTotal > 0 ? (good / updatedTotal) * 100 : 0;
    setPositivePercentage(positivePercentage);
  }
  
  return (
    <div>
      <Header title={title}></Header>
      <div className='flex'>
        <Button onClick={handlegoodClick} text="good"></Button>
        <Button onClick={handleneutralClick} text="neutral"></Button>
        <Button onClick={handlebadClick} text="bad"></Button> 
      </div>
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