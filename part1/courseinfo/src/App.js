import React from 'react'

const Header = (props) => {

  return ( <h1>{props.course}</h1> ); 

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
    <Part part={x.part} exercise={x.exercises} />
  ) } );

  return (
    <div>
      {parts}
    </div>
  );

}

const Total = (props) => {

  return ( <p>Number of exercises {props.exercises}</p> );
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const parts = [ 
    { part: part1, exercises: exercises1 },
    { part: part2, exercises: exercises2 },
    { part: part3, exercises: exercises3 }
  ];

  const total = exercises1 + exercises2 + exercises3;

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total exercises={total} />
    </div>
  )
}

export default App