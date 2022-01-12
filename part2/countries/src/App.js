import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({value, onChange}) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      find countries <input value={value} onChange={onChange} />
    </form>
  );
};

const Button = ({value, onClick}) => {
  return (
    <button onClick={onClick}>{value}</button>
  );
};

const CountryList = ({countries, setter}) => {

  if (countries.length < 1) {
    return (<div>'No Countries Found'</div>);
  } 

  if (countries.length > 10) {
    return (<div>Too many matches, specify another filter</div>);
  }

  if (countries.length > 1) {
    const countryNames = countries.map( x => <div key={x.name.common}>{x.name.common}<Button onClick={() => setter(x.name.common)} value="show" /></div> );
    return (<div>{countryNames}</div>);
  }

  const selectedCountry = countries[0];
  const languagesList = Object.values(selectedCountry.languages).map( x => <li key={x}>{x}</li> );

  return (
    <div>
      <h2>{selectedCountry.name.common}</h2>

      <div>capital {selectedCountry.capital}</div>
      <div>population {selectedCountry.population}</div>

      <h3>languages</h3>
      <div>{languagesList}</div>

      <div><img src={selectedCountry.flags.png} alt="Country flag" /></div>
      <Weather city={selectedCountry.capital} />
     </div>
  );
};

const Weather = ({city}) => {

  const api_key = process.env.REACT_APP_API_KEY;
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    /*
    console.log("weather empty: ", Object.keys(weatherData).length === 0);
    
    if (Object.keys(weatherData).length !== 0) {
      console.log("weather not empty");
      return;
    }

    console.log(`retrieving weatherData for ${city}`);
    */

    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`)
      .then(response => {
        console.log("axios responded", response.data);
        setWeatherData(response.data);
      });
  }, [city, api_key]);

  console.log("weather data: ", weatherData);

  let temperature = '';
  let pic = '';
  let windSpeed = '';
  let windDir = '';


  const getDirection = angle => {
    const compass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return (compass[Math.round((angle / 22.5)) % 16]);
  };

  if (Object.keys(weatherData).length > 0) {
    temperature = weatherData.main.temp;
    pic = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    windSpeed = weatherData.wind.speed;
    windDir = getDirection(weatherData.wind.deg);
  }

  return (
    <div>
      <h3>Weather in {city}</h3>
      <div><b>temperature: </b>{temperature} C</div>
      <div><img src={pic} alt="Weather Icon" /></div>
      <div><b>wind: </b>{windSpeed} km/h <b>direction</b> {windDir}</div>
    </div>
  );
};

const App = () => {

  const [dataset, setDataset] = useState([]);
  const [filtertext, setFiltertext] = useState('');
 
  const handleFilterChange = (event) => {
    setFiltertext(event.target.value);
  };

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/all/`)
      .then(response => {
        setDataset(response.data);
      });
  }, []);

  const regex = new RegExp(filtertext, "i");
  const filteredCountries = ( filtertext === '' ? [...dataset] : dataset.filter( x => regex.test(x.name.common) ));

  return (
    <div>
      <Filter value={filtertext} onChange={handleFilterChange} />
      <CountryList countries={filteredCountries} setter={setFiltertext} />
      
    </div>
  );
};

export default App;
