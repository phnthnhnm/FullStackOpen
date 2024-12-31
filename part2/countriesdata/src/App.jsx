import React, { useState, useEffect } from 'react'
import countriesService from './services/countries'
import CountryList from './components/CountryList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    countriesService.getAll().then((initialCountries) => {
      setCountries(initialCountries)
    })
  }, [])

  useEffect(() => {
    setFilteredCountries(countries.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase())))
  }, [search, countries])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        Find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      {filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
      {filteredCountries.length <= 10 && <CountryList countries={filteredCountries} />}
    </div>
  )
}

export default App
