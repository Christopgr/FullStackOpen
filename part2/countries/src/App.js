import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

const CountryInfo = ({ country, visible }) =>
    visible
        ?
        <div id={country.alpha2Code} className="hide" >
            <h1>{country.name}</h1>
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>
            <ul>
                <h2>languages</h2>
                {country.languages.map(language =>
                    <li key={language.name}>{language.name}</li>
                )}
            </ul>
            <img src={country.flag} />
            <WeatherInfo capital={country.capital} />
        </div>
        : null

const WeatherInfo = ({ capital }) => {
    axios
        .get('api.openweathermap.org/data/2.5/weather?q=' + capital + '&appid=7df3d839bb40e1cf430fec5dea6d22f8')
        .then(response => {
            console.log(response.data)
            return (
                <div>hello</div>
            )
        })
}

const App = () => {


    const [countries, setCountries] = useState([]);
    const [countriesFilter, setCountriesFilter] = useState('')

    const hook = () => {
        console.log('effect')
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                setCountries(response.data)
            })
    }

    useEffect(hook, [])


    const handleChange = (event) => {
        setCountriesFilter(event.target.value)
    }

    const toggleVisibility = (event) => {

    }

    const countriesToShow = countriesFilter === ''
        ? []
        : countries.filter(country => country.name.toLowerCase().includes(countriesFilter.toLowerCase()))


    if (countriesToShow.length > 10) {
        return (
            <>
                find countries
                <input value={countriesFilter} onChange={handleChange} />
                <div>Too many matches, specify another filter</div>
            </>
        )
    } else if (countriesToShow.length == 1) {

        const countryInfo = countriesToShow[0]
        console.log(countryInfo)
        return (
            <>
                find countries
                <input value={countriesFilter} onChange={handleChange} />
                <CountryInfo key={countryInfo.name} country={countryInfo} />
            </>
        )
    }

    return (
        <>
            find countries
            <input value={countriesFilter} onChange={handleChange} />
            {countriesToShow.map(country =>
                <div key={country.alpha2Code}>
                    <div>{country.name}
                        <button type="button" value={country.alpha2Code} onClick={toggleVisibility}>
                            show
                        </button>
                    </div>
                    <CountryInfo key={country.name} country={country} visible={} />
                </div>
            )}
        </>
    )
}

export default App