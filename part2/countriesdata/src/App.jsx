import React, { useState, useEffect } from 'react'
import countriesService from './services/countries'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

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
    setSelectedCountry(null)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        Find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      {filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && <CountryList countries={filteredCountries} onShowCountry={handleShowCountry} />}
      {filteredCountries.length === 1 && <CountryDetails country={filteredCountries[0]} />}
      {selectedCountry && <CountryDetails country={selectedCountry} />}
    </div>
  )
}

export default App
