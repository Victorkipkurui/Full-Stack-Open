import React from 'react'

const Header = ({title, stats}) => {
  
  return (
    <>
    <div>
      <h1>{title}</h1>
    </div>
     <div>
     <h1>{stats}</h1>
    </div>
    </>
  )
}

export default Header