import React, { useState, useEffect, useCallback } from "react";
import './App.css';

// Firebase imports
import { initializeApp } from "firebase/app";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA9U600x7hMflwTlK2u3TNoFsq8GXbc1to",
  authDomain: "weather-application-2b008.firebaseapp.com",
  projectId: "weather-application-2b008",
  storageBucket: "weather-application-2b008.firebasestorage.app",
  messagingSenderId: "882186970190",
  appId: "1:882186970190:web:776e9551dccdf946824f1f",
  measurementId: "G-NRL2XY7WPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Weather API Key and URL
const apiKey = "dff666bd9f522490275b20ceb1aa7fc2"; // Replace with your OpenWeatherMap API key
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error("City not found or error fetching data");
      }

      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Application</h1>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>

        {loading && <p>Fetching weather data...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {weatherData && !error && (
          <div>
            <h2>
              {weatherData.name}, {weatherData.sys?.country}
            </h2>
            <p>Temperature: {weatherData.main?.temp}°C</p>
            <p>Weather: {weatherData.weather?.[0]?.description}</p>
            <p>Humidity: {weatherData.main?.humidity}%</p>
            <p>Wind Speed: {weatherData.wind?.speed} m/s</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
