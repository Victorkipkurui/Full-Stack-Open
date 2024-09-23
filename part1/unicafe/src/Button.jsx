import React from 'react'

const Button = ({onClick, text}) => {
  return (
    <div>
      <p><button onClick={onClick}>{text}</button></p>
    </div>
  )
}

export default Button