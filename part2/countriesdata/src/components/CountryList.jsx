import React from 'react'

const CountryList = ({ countries, onShowCountry }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.cca3}>
          {country.name.common} <button onClick={() => onShowCountry(country)}>show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
