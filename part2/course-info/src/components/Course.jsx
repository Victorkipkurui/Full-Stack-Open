import React from 'react'
import Part from './Part'

const Headers = ({courses}) => {
  return (
    <div>
     
    </div>
  )
}
const Content = ({courses}) => {
  return (
    <div>
      <Part courses={courses}></Part>
    </div>
  )
}

const Course = ({courses}) => {
  return (
    <div>
      <h1>Web Development curriculum</h1>
      <Headers courses={courses}></Headers>
      <Content courses={courses}></Content>
    </div>
  )
}

export default Course