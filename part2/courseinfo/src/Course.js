import React from 'react'

const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
  }
  
  const Total = ({ course }) => {
    
    const exercises = course.parts.map(x => x.exercises).reduce( (a, b) => a+b );
  
    return ( <p>Number of exercises {exercises}</p> );
  }
  
  const Part = (props) => {
    console.log("Part:", props);
    return (
      <p>
        {props.part} {props.exercise}
      </p>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    );
  };
  
  const Content = ({ course }) => {
  
    const parts = course.parts.map( (x,i) => { return (
      <Part key={i+x.name} part={x.name} exercise={x.exercises} />
    ) } );
  
  
    return (
      <div>
        {parts}
      </div>
    );
  
  }

export default Course