import { useState } from 'react'
import Header from './Header'
import Button from './Button';
import Statistics from './Statistics';
import './App.css';


const App = () => {
  
  const title = 'give feedback';
  const stats = 'statistics';
  const max = 'Anecdote with most votes'
  const anecdotes = [
    'The best way to get a project done faster is to start sooner',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Even the best planning is not so omniscient as to get it right the first time.',
    'The bearing of a child takes nine months, no matter how many women are assigned. Many software tasks have this characteristic because of the sequential nature of debugging.',
    "Every good work of software starts by scratching a developer's personal itch"
  ]

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0));

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
  const handleNextClick = () => {
      const randomIndex = Math.floor(Math.random() * anecdotes.length);
      setSelected(randomIndex);

  }  
  const voteClick = () => {
    const votesCopy = [...vote,];
    votesCopy[selected]+=1;
    setVote(votesCopy);
  }
  const getMaxVotes = () => {
    const maxVotes = Math.max(...vote);
    const maxIndex = vote.indexOf(maxVotes);
    return {
      item: anecdotes[maxIndex],
      votes: maxVotes
    };
  }
  const maxVoted = getMaxVotes();

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
      <br></br>
      <div>
        {anecdotes[selected]}
      </div>
      <p>votes {vote[selected]}</p>
      <div className='flex'>
        <Button onClick={voteClick} text='vote'></Button>
        <Button onClick={handleNextClick} text='next anecdote'></Button>
      </div>
      <Header max={max}></Header>
      {maxVoted.votes > 0 ? (
        <div>
           {maxVoted.item} 
        <p>
        {maxVoted.votes} votes
        </p>
        </div>
      ) : (
        <p>No votes yet</p>
      )}
    </div>
  )
}

export default App