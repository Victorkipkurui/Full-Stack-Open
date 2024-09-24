import { useState } from 'react';
import './App.css';

const App = () => {
  const title = 'Anecdote of the day'
  const max = 'Anecdote with most votes';
  const anecdotes = [
    'The best way to get a project done faster is to start sooner',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Even the best planning is not so omniscient as to get it right the first time.',
    'The bearing of a child takes nine months, no matter how many women are assigned. Many software tasks have this characteristic because of the sequential nature of debugging.',
    "Every good work of software starts by scratching a developer's personal itch"
  ];

  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0));

  const handleNextClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const voteClick = () => {
    const votesCopy = [...vote];
    votesCopy[selected] += 1;
    setVote(votesCopy);
  };

  const getMaxVotes = () => {
    const maxVotes = Math.max(...vote);
    const maxIndex = vote.indexOf(maxVotes);
    return {
      item: anecdotes[maxIndex],
      votes: maxVotes
    };
  };
  
  const maxVoted = getMaxVotes();

  return (
    <>
      <h2>{title}</h2>
      <div>{anecdotes[selected]}</div>
      <p>votes {vote[selected]}</p>
      <div className='flex'>
        <button onClick={voteClick}>vote</button>
        <button onClick={handleNextClick}>next anecdote</button>
      </div>
      <h2>{max}</h2>
      {maxVoted.votes > 0 ? (
        <div>
          {maxVoted.item}
          <p>{maxVoted.votes} votes</p>
        </div>
      ) : (
        <p>No votes yet</p>
      )}
    </>
  );
};

export default App;
