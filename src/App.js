import React, { useState, useEffect } from "react";
import "./App.css";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast-weather";
import { weatherAPIurl, weatherAPIkey, geoAPIoptions, geoAPIurl } from "./api";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);

  const handleOnSearchChange = (searchData) => {
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
    console.log("🌍 Getting current location...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Coordinates:", latitude, longitude);

        try {
          const geoRes = await fetch(
            `${geoAPIurl}/cities?location=${latitude}${longitude >= 0 ? "%2B" : ""}${longitude}&radius=20&limit=1`,
            geoAPIoptions
          );
          const geoData = await geoRes.json();
          console.log("🗺️ GeoDB response:", geoData);

          if (geoData?.data?.length > 0) {
            const city = geoData.data[0];
            const searchData = {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
            console.log("🔁 Using city:", searchData);
            handleOnSearchChange(searchData);
          } else {
            console.warn("No city data found from coordinates.");
          }
        } catch (err) {
          console.error("⚠️ Reverse geocoding error:", err);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }, []);


  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecastWeather && <Forecast data={forecastWeather} />}
    </div>
  );
}

export default App;
