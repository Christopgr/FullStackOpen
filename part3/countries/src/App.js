import React, { useState, useEffect } from 'react';
import axios from 'axios'

const CountryInfo = ({ country, visible }) =>
    <div id={country.alpha2Code} className={visible} >
        <h1>{country.name}</h1>
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
        <ul>
            <h2>languages</h2>
            {country.languages.map(language =>
                <li key={language.name}>{language.name}</li>
            )}
        </ul>
        <img src={country.flag} alt={country.name} />
    </div>

const WeatherInfo = ({ capital, weather }) => {
    console.log(weather)
    if (weather !== null) {
        return (
            <>
                <h2>Weather in {capital}</h2>
                <div><strong>temperature:</strong> {weather.main.temp}</div>
                <div><strong>wind:</strong> {weather.wind.speed}</div>
            </>
        )
    } else {
        return (<div></div>)
    }
}

const App = () => {


    const [countries, setCountries] = useState([]);
    const [countriesFilter, setCountriesFilter] = useState('')
    const [weather, setWeather] = useState([])

    const hook = () => {
        console.log('effect')
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                setCountries(response.data)
                console.log(countries)
            })
    }

    useEffect(hook, [])




    const handleChange = (event) => {
        setCountriesFilter(event.target.value)
    }

    const toggleVisibility = (event) => {
        document.getElementById(event.target.value).classList.toggle("hide")
    }

    const countriesToShow = countriesFilter === ''
        ? []
        : countries.filter(country => country.name.toLowerCase().includes(countriesFilter.toLowerCase()))

    const weatherHook = () => {
        if (countriesToShow.length > 0) {
            const urlBuilder = 'https://api.openweathermap.org/data/2.5/weather?q=' + countriesToShow[0].capital + '&units=metric&appid=7df3d839bb40e1cf430fec5dea6d22f8'
            axios
                .get(urlBuilder)
                .then(response => {
                    setWeather(response.data)
                })
        }
    }

    useEffect(weatherHook, [countriesFilter])

    if (countriesToShow.length > 10) {
        return (
            <>
                find countries
                <input value={countriesFilter} onChange={handleChange} />
                <div>Too many matches, specify another filter</div>
            </>
        )
    } else if (countriesToShow.length === 1) {

        const countryInfo = countriesToShow[0]
        console.log(countryInfo)
        return (
            <>
                find countries
                <input value={countriesFilter} onChange={handleChange} />
                <CountryInfo key={countryInfo.name} country={countryInfo} />
                <WeatherInfo capital={countryInfo.capital} weather={weather} />
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
                    <CountryInfo key={country.name} country={country} visible={"hide"} />
                </div>
            )}
        </>
    )
}

export default App