import React, { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const [lat, lon] = country.capitalInfo.latlng
    weatherService.getWeather(lat, lon).then((data) => {
      setWeather(data.current_weather)
    })
  }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <p>Languages:</p>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind: {weather.windspeed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default CountryDetails
