/*!
 * Sartorius Frontend Live Code Challenge
 *
 * The goal of this challenge is to create a simple web application that displays a list of countries
 * and allows the user to filter and sort them.
 *
 *  1. Connect to the Rest Countries API (https://restcountries.com) to fetch the list of countries.
 *  2. Create a Type or Interface for the necessary data.
 *  3. Display the countries in a table with the following columns:
 *    - Flag
 *    - Name
 *    - Population
 *    - Area
 *    - Number of borders
 *  4. Implement the filters and sorting logic for:
 *    - Search by country name
 *    - Minimum number of borders
 *    - Order by Name, Population, Area, Number of borders
 *    - Order direction Ascending, Descending
 *  5. Allow the user to remove a country from the list.
 *  Ask about further improvements + testing
 */

import { useState, useEffect, useCallback } from "react";
import trashcan from "./assets/trashcan.svg";
import world from "./assets/world.png";
import "./App.css";

interface Country {
  area: number;
  borders: string[];
  flags: {
    svg: string;
  };
  name: {
    common: string;
    official: string;
  };
  population: number;
}

function App() {
  const [noOfBorders, setNoOfBorders] = useState(0);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"name" | "population" | "area" | "borders">("name");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      // fetch countries data on mount
      const response = await fetch("https://restcountries.com/v3.1/all");
      const responseJson: Country[] = await response.json();
      // add borders field to countries that don't have it
      setCountries(
        responseJson
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map((c) => ({ ...c, borders: c.borders || [] }))
      );
    };

    loadCountries();
  }, []);

  const getSortingFunction = useCallback((a: Country, b: Country) => {
    if (orderBy === "name") {
      return a.name.common.localeCompare(b.name.common);
    } else if (orderBy === "population") {
      return a.population - b.population;
    } else if (orderBy === "area") {
      return a.area - b.area;
    } else {
      return a.borders.length - b.borders.length;
    }
  }, []);

  const removeCountry = useCallback((country: Country) => {
    setCountries((countries) => countries.filter((c) => c.name.common !== country.name.common));
  }, []);

  useEffect(() => {
    const newArray = [...countries]
      .filter((c) => c.borders && c.borders.length >= noOfBorders)
      .filter((c) => c.name.common.toLowerCase().includes(search.toLowerCase()));

    if (orderBy === "name") {
      newArray.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (orderBy === "population") {
      newArray.sort((a, b) => a.population - b.population);
    } else if (orderBy === "area") {
      newArray.sort((a, b) => a.area - b.area);
    } else {
      newArray.sort((a, b) => a.name.common.localeCompare(b.name.common));
      newArray.sort((a, b) => a.borders.length - b.borders.length);
    }

    if (orderDirection === "desc") {
      newArray.reverse();
    }

    setCountries(newArray);
  }, [noOfBorders, search, orderBy, orderDirection, getSortingFunction]);

  return (
    <>
      <div className="title">
        <img src={world} alt="world" />
        <h1>World Countries</h1>
      </div>

      <div className="filter">
        <p>Search</p>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="filter">
        <p>Minimum no. of borders</p>
        <div className="border_filter">
          <button className="round-button" disabled={noOfBorders === 0} onClick={() => setNoOfBorders((b) => b - 1)}>
            -
          </button>
          <p>{noOfBorders}</p>
          <button className="round-button" onClick={() => setNoOfBorders((b) => b + 1)}>
            +
          </button>
        </div>
      </div>

      <div className="filter">
        <p>Order by</p>
        <label htmlFor="name">
          <input
            type="radio"
            name="orderBy"
            value="name"
            id="name"
            checked={orderBy === "name"}
            onChange={() => setOrderBy("name")}
          />
          Name
        </label>

        <label htmlFor="population">
          <input
            type="radio"
            name="orderBy"
            value="population"
            id="population"
            checked={orderBy === "population"}
            onChange={() => setOrderBy("population")}
          />
          Population
        </label>

        <label htmlFor="area">
          <input
            type="radio"
            name="orderBy"
            value="area"
            id="area"
            checked={orderBy === "area"}
            onChange={() => setOrderBy("area")}
          />
          Area
        </label>

        <label htmlFor="borders">
          <input
            type="radio"
            name="orderBy"
            value="borders"
            id="borders"
            checked={orderBy === "borders"}
            onChange={() => setOrderBy("borders")}
          />
          No. of borders
        </label>
      </div>

      <div className="filter">
        <p>Order direction</p>
        <label htmlFor="asc">
          <input
            type="radio"
            name="orderDirection"
            value="asc"
            id="asc"
            checked={orderDirection === "asc"}
            onChange={(e) => setOrderDirection(e.target.value === "asc" ? "asc" : "desc")}
          />
          Ascending
        </label>

        <label htmlFor="desc">
          <input
            type="radio"
            name="orderDirection"
            value="desc"
            id="desc"
            checked={orderDirection === "desc"}
            onChange={(e) => setOrderDirection(e.target.value === "asc" ? "asc" : "desc")}
          />
          Descending
        </label>
      </div>

      <table className="countries">
        <thead>
          <tr>
            <th style={{ width: 70, textAlign: "center" }}>Flag</th>
            <th>Name</th>
            <th>Population</th>
            <th>Area (km²)</th>
            <th>No. of borders</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr className="country" key={country.name.common}>
              <td style={{ width: "10%" }} className="flag_td">
                {country.flags.svg && <img className="flag" src={country.flags.svg} alt={country.name.common} />}
              </td>
              <td style={{ width: "27%" }}>{country.name.common}</td>
              <td style={{ width: "18%" }}>{country.population}</td>
              <td style={{ width: "18%" }}>{country.area}</td>
              <td style={{ width: "20%" }}>{country.borders?.length}</td>
              <td style={{ width: "7%" }}>
                <img onClick={() => removeCountry(country)} className="trashcan" src={trashcan} alt="trashcan" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
