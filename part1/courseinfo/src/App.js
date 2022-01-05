import React from 'react'

const Header = (props) => {

  return ( <h1>{props.course.name}</h1> ); 

}

const Part = (props) => {

  return (
    <p>
      {props.part} {props.exercise}
    </p>
  );

}

const Content = (props) => {

  const parts = props.parts.map( x => { return (
    <Part part={x.name} exercise={x.exercises} />
  ) } );

  return (
    <div>
      {parts}
    </div>
  );

}

const Total = (props) => {
  
  const exercises = props.parts.map(x => x.exercises).reduce( (a, b) => a+b );

  return ( <p>Number of exercises {exercises}</p> );
}

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App