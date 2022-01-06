import React, { useState } from 'react'


const Statistics = ({feedback}) => {
  /// ...
  if ( feedback.good === 0 && feedback.neutral === 0 && feedback.bad === 0 ) return (<p>No feedback given</p>);

  const all = feedback.good + feedback.neutral + feedback.bad;
  const average = feedback.good + (feedback.bad * -1);
  const positive = feedback.good / all * 100 + '%';

  return(
    <table>
      <StatisticLine text="good" value ={feedback.good} />
      <StatisticLine text="neutral" value ={feedback.neutral} />
      <StatisticLine text="bad" value ={feedback.bad} />
      <StatisticLine text="all" value ={all} />
      <StatisticLine text="average" value ={average} />
      <StatisticLine text="positive" value ={positive} />
    </table>
  );
};

const StatisticLine = ({text, value}) => (
  <tr>
    <td>{text}</td><td>{value}</td>
  </tr>
);

const Header = ({text}) => (<h1>{text}</h1>);

const Button = ({handler, text}) => {

  return (
    <button onClick={handler}>
      {text}
    </button>
  );
};


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedback={
    good: good,
    neutral: neutral,
    bad: bad
  };
  
  return (
    <div>
      <Header text="give feedback" />
      <Button handler={ () => setGood(good + 1) } text="good" />
      <Button handler={ () => setNeutral(neutral + 1) } text="neutral" />
      <Button handler={ () => setBad(bad + 1) } text="bad" />

      <Header text="statistics" />
      <Statistics feedback={ feedback } />
      
    </div>
  )
}

export default App
