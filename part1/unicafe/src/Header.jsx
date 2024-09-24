import React from 'react'

const Header = ({title, stats, max}) => {
  
  return (
    <>
    <div>
      <h1>{title}</h1>
    </div>
     <div>
     <h1>{stats}</h1>
    </div>
    <div>
     <h2>{max}</h2>
    </div>
    </>
  )
}

export default Header