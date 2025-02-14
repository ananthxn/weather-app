// Code for the main App component in weather-app/src/App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { weatherAPIurl, weatherAPIkey } from "./api";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);

  const handleOnSearchChange = (searchData) => {
    console.log("Search Data:", searchData);
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${weatherAPIurl}/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIkey}&units=metric`
    );
    const forecastWeatherFetch = fetch(
      `${weatherAPIurl}/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPIkey}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastWeatherFetch])
      .then(async (responses) => {
        const currentWeatherResponse = await responses[0].json();
        const forecastWeatherResponse = await responses[1].json();

        setCurrentWeather({ city: searchData.label, ...currentWeatherResponse });
        setForecastWeather({ city: searchData.label, ...forecastWeatherResponse });
      })
      .catch((error) => {
        console.error("API Fetch Error:", error);
      });
  };

  useEffect(() => {
    console.log("Updated currentWeather:", currentWeather);
    console.log("Updated forecastWeather:", forecastWeather);
  }, [currentWeather, forecastWeather]);

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecastWeather && <Forecast data={forecastWeather} />}
    </div>
  );
}

export default App;
