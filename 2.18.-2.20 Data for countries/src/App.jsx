import React, { useState, useEffect } from "react";
import axios from "axios";

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} sq km</p>
      <h3>Languages:</h3>
      <ul>
        {Array.isArray(country.languages) ? (
          country.languages.map((language, index) => (
            <li key={index}>{language}</li>
          ))
        ) : (
          <li>{country.languages}</li>
        )}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width={150}
      />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  useEffect(() => {
    setSelectedCountry(null);
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCountryView = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <div>
        find countries:{" "}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter country name"
        />
      </div>
      {countries.length > 0 ? (
        <ul>
          {countries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}{" "}
              <button onClick={() => handleCountryView(country)}>View</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      {selectedCountry && <Country country={selectedCountry} />}
    </div>
  );
};

export default App;
