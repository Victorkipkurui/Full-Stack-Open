import React from 'react'

const Display = ({good, neutral, bad, total, average, positivePercentage}) => {
  return (
    <div>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {total}</p>
      <p>average {average}</p>
      <p>positive {positivePercentage}</p>
    </div>
  )
}

export default Display