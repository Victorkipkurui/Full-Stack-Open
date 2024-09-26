import React, { useState, useEffect } from 'react';
import countriesService from './services/countries';
import weatherService from './services/weather';

const RenderCountries = ({ filteredCountries, showCountryDetails, renderCountryDetails}) => {
  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length > 1) {
    return (
      <ul>
        {filteredCountries.map((country) => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => showCountryDetails(country)}>show</button>
          </li>
        ))}
      </ul>
    );
  } else if (filteredCountries.length === 1) {
    return renderCountryDetails(filteredCountries[0]);
  }
  return null;
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);


  useEffect(() => {
    countriesService
      .getCountries()
      .then((initialData) => {
        setCountries(initialData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    const query = event.target.value.toLowerCase();

    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(query)
    );

    setFilteredCountries(filtered);
    setSelectedCountry(null);
  };

  const showCountryDetails = (country) => {
    setSelectedCountry(country);
    weatherService.getWeather(country.capital[0])
      .then(weatherData => {
        setWeather(weatherData);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const renderCountryDetails = (country) => {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area} km²</p>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          width="200"
        />
          {weather ? (
          <div>
            <h3>Weather in {country.capital}</h3>
            <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
            <p><strong>Weather:</strong> {weather.weather[0].description}</p>
            <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Find Countries</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search for a country"
      />
      
      {/* If a country is selected, show details */}
      {selectedCountry ? (
        renderCountryDetails(selectedCountry)
      ) : (
        <RenderCountries
          filteredCountries={filteredCountries}
          showCountryDetails={showCountryDetails}
          renderCountryDetails={renderCountryDetails}
        />
      )}
    </div>
  );
};

export default App;
