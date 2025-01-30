/*!
 * Sartorius Frontend Live Code Challenge
 *
 * The goal of this challenge is to create a simple web application that displays a list of countries
 * and allows the user to filter and sort them.
 *
 *  1. Connect to the Rest Countries API (https://restcountries.com) to fetch the list of countries (/all endpoint).
 *  2. Load the data and sort it by the country common name when the component is loaded.
 *  3. Fix the errors in the implementation and the missing features.
 */

import { useState } from "react";
import trashcan from "./assets/trashcan.svg";
import world from "./assets/world.png";
import "./App.css";

interface Country {
  area: number;
  borders?: string[];
  flags: {
    img: string;
  };
  name: {
    common: string;
    official: string;
  };
  population: {
    currentYear: number;
  };
}

function App() {
  const [noOfBorders, setNoOfBorders] = useState(0);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"name" | "population" | "area" | "borders">("name");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [countries, setCountries] = useState<Country[]>([]);

  return (
    <>
      <div className="title">
        <img src={world} alt="world" />
        <h1>World Countries</h1>
      </div>

      <div className="filter_sorter">
        <p>Name search</p>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="filter_sorter">
        <p>Minimum no. of borders</p>
        <div className="border_filter">
          <button className="round-button" onClick={() => setNoOfBorders((b) => b - 1)}>
            -
          </button>
          <p>{noOfBorders}</p>
          <button className="round-button" onClick={() => setNoOfBorders((b) => b + 1)}>
            +
          </button>
        </div>
      </div>

      <div className="filter_sorter">
        <p>Order by</p>
        <label htmlFor="name">
          <input
            type="radio"
            name="orderBy"
            value="name"
            id="name"
            // checked={false}
            // onChange={() => {}}
          />
          Name
        </label>

        <label htmlFor="population">
          <input
            type="radio"
            name="orderBy"
            value="population"
            id="population"
            // checked={false}
            // onChange={() => {}}
          />
          Population
        </label>

        <label htmlFor="area">
          <input
            type="radio"
            name="orderBy"
            value="area"
            id="area"
            // checked={false}
            // onChange={() => {}}
          />
          Area
        </label>

        <label htmlFor="borders">
          <input
            type="radio"
            name="orderBy"
            value="borders"
            id="borders"
            // checked={false}
            // onChange={() => {}}
          />
          No. of borders
        </label>
      </div>

      <div className="filter_sorter">
        <p>Order direction</p>
        <label htmlFor="asc">
          <input
            type="radio"
            name="orderDirection"
            value="asc"
            id="asc"
            checked={orderDirection === "asc"}
            onChange={() => setOrderDirection("asc")}
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
            onChange={() => setOrderDirection("desc")}
          />
          Descending
        </label>
      </div>

      <table className="countries">
        <thead>
          <tr>
            <th className="flag_head">Flag</th>
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
                {country.flags.img && <img className="flag" src={country.flags.img} alt={country.name.common} />}
              </td>
              <td style={{ width: "27%" }}>{country.name.common}</td>
              <td style={{ width: "18%" }}>{country.population.currentYear}</td>
              <td style={{ width: "18%" }}>{country.area}</td>
              <td style={{ width: "20%" }}>{country.borders?.length}</td>
              <td style={{ width: "7%" }}>
                <img className="trashcan" src={trashcan} alt="trashcan" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
