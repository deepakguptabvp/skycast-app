"use client";
import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import SearchInputBox from "./SearchInputBox";
import CurrentWeather from "./CurrentWeather";
import WeatherMetrics from "./WeatherMetrics";
import HourlyForecast from "./HourlyForecast";
import WeatherForecast from "./WeatherForecast";
import AirQualityCard from "./AirQualityCard";
import LifestyleIndex from "./LifestyleIndex";
import FavoritesModal from "./FavoritesModal";
import CompareModal from "./CompareModal";
import WeatherSkeleton from "./WeatherSkeleton";
import ErrorState from "./ErrorState";
import WeatherBackgroundAnimation from "./WeatherBackgroundAnimation";
import { getWeatherTheme } from "../utils/utility";

const API_KEY = "776ee648de6a5eb986f140c70c3eb660";

const App = () => {
  const [currentCity, setCurrentCity] = useState("Delhi");
  const [currentWeatherData, setCurrentWeatherData] = useState({
    loading: true,
    error: "",
    data: null,
  });
  const [weatherForecastData, setWeatherForecastData] = useState({
    loading: true,
    error: "",
    data: null,
  });
  const [airQualityData, setAirQualityData] = useState(null);

  const [unit, setUnit] = useState("metric");
  const [savedCities, setSavedCities] = useState([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [geoNotice, setGeoNotice] = useState("");

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedUnit = localStorage.getItem("skycast_unit");
      if (storedUnit) setUnit(storedUnit);

      const storedFavorites = localStorage.getItem("skycast_favorites");
      if (storedFavorites) {
        setSavedCities(JSON.parse(storedFavorites));
      } else {
        setSavedCities(["Delhi", "Mumbai", "Bengaluru", "Jaipur"]);
      }
    } catch (_e) {
      console.warn("Error accessing localStorage:", _e);
    }
  }, []);

  // Update localStorage when unit changes
  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem("skycast_unit", newUnit);
    } catch {}
  };

  // Weather data fetcher
  const fetchWeather = useCallback(async (params) => {
    let weatherUrl = "";
    let forecastUrl = "";

    if (params.lat && params.lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&units=metric&appid=${API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${params.lat}&lon=${params.lon}&units=metric&appid=${API_KEY}`;
    } else {
      const cityQuery = encodeURIComponent(params.city || "Delhi");
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&units=metric&appid=${API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityQuery}&units=metric&appid=${API_KEY}`;
    }

    setCurrentWeatherData((prev) => ({ ...prev, loading: true, error: "" }));
    setWeatherForecastData((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(weatherUrl).then((res) => res.json()),
        fetch(forecastUrl).then((res) => res.json()),
      ]);

      if (currentRes?.cod === 200) {
        setCurrentWeatherData({
          loading: false,
          error: "",
          data: currentRes,
        });
        setCurrentCity(currentRes.name);

        // Fetch Air Pollution data using coordinates
        if (currentRes.coord?.lat && currentRes.coord?.lon) {
          fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentRes.coord.lat}&lon=${currentRes.coord.lon}&appid=${API_KEY}`
          )
            .then((r) => r.json())
            .then((aqData) => {
              if (aqData?.list) setAirQualityData(aqData);
            })
            .catch(() => {});
        }

        // Set last updated time
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } else {
        setCurrentWeatherData({
          loading: false,
          error: currentRes?.message || "Location not found. Please try another Indian city or state.",
          data: null,
        });
      }

      if (forecastRes?.cod === "200") {
        setWeatherForecastData({
          loading: false,
          error: "",
          data: forecastRes,
        });
      } else {
        setWeatherForecastData({
          loading: false,
          error: forecastRes?.message || "Failed to load forecast data.",
          data: null,
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setCurrentWeatherData({
        loading: false,
        error: "Unable to reach weather service. Please check your network.",
        data: null,
      });
      setWeatherForecastData({
        loading: false,
        error: "Unable to reach forecast service.",
        data: null,
      });
    }
  }, []);

  // Initial load: start with Delhi
  useEffect(() => {
    fetchWeather({ city: "Delhi" });
  }, [fetchWeather]);

  // Handle Search submit
  const handleSearch = (city) => {
    if (city) {
      setGeoNotice("");
      fetchWeather({ city });
    }
  };

  // Highly resilient Geolocation with multi-step fallback (GPS -> WiFi -> IP Geolocation)
  const handleLocationSearch = async () => {
    setIsGeoLoading(true);
    setGeoNotice("Detecting your location...");

    const executeCoords = (lat, lon, source = "GPS") => {
      setIsGeoLoading(false);
      setGeoNotice(`Found location via ${source}! Loading weather...`);
      setTimeout(() => setGeoNotice(""), 3500);
      fetchWeather({ lat, lon });
    };

    // IP Geolocation fallback
    const fallbackToIp = async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        if (ipData && ipData.latitude && ipData.longitude) {
          executeCoords(ipData.latitude, ipData.longitude, "Network IP");
          return;
        }
      } catch {}

      // If IP lookup fails, default safely to Delhi with message
      setIsGeoLoading(false);
      setGeoNotice("Location unavailable. Defaulting to Delhi.");
      setTimeout(() => setGeoNotice(""), 4000);
      fetchWeather({ city: "Delhi" });
    };

    // Check browser navigator.geolocation
    if (!navigator.geolocation) {
      await fallbackToIp();
      return;
    }

    // Step 1: High accuracy GPS attempt
    navigator.geolocation.getCurrentPosition(
      (position) => {
        executeCoords(position.coords.latitude, position.coords.longitude, "Device GPS");
      },
      () => {
        // Step 2: Low accuracy WiFi attempt
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            executeCoords(pos.coords.latitude, pos.coords.longitude, "WiFi Location");
          },
          async () => {
            // Step 3: Seamless IP fallback
            await fallbackToIp();
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
    );
  };

  // Refresh current city
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWeather({ city: currentCity });
    setIsRefreshing(false);
  };

  // Favorites management
  const isCurrentFavorite = savedCities.some(
    (c) => c.toLowerCase() === currentCity.toLowerCase()
  );

  const toggleFavorite = () => {
    setSavedCities((prev) => {
      let updated;
      if (isCurrentFavorite) {
        updated = prev.filter(
          (c) => c.toLowerCase() !== currentCity.toLowerCase()
        );
      } else {
        updated = [currentCity, ...prev];
      }
      try {
        localStorage.setItem("skycast_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeFavorite = (cityToRemove) => {
    setSavedCities((prev) => {
      const updated = prev.filter(
        (c) => c.toLowerCase() !== cityToRemove.toLowerCase()
      );
      try {
        localStorage.setItem("skycast_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Dynamic Theme Gradient & Animated Background
  const weatherCode = currentWeatherData?.data?.weather?.[0]?.id || 800;
  const weatherIcon = currentWeatherData?.data?.weather?.[0]?.icon || "01d";
  const currentTemp = currentWeatherData?.data?.main?.temp ?? 25;
  const theme = getWeatherTheme(weatherCode, weatherIcon, currentTemp);

  const isLoading = currentWeatherData.loading && !currentWeatherData.data;
  const hasError = !currentWeatherData.loading && currentWeatherData.error;

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${theme.gradient} transition-colors duration-1000 relative overflow-x-hidden pb-12`}
    >
      {/* Dynamic Animated Weather Background Layer */}
      <WeatherBackgroundAnimation
        weatherCode={weatherCode}
        icon={weatherIcon}
        temp={currentTemp}
      />

      {/* Dynamic Background Noise / Radial Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/35 pointer-events-none z-[1]" />

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Navigation / Header */}
        <Header
          unit={unit}
          setUnit={handleUnitChange}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          savedCities={savedCities}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenCompare={() => setIsCompareOpen(true)}
          lastUpdated={lastUpdated}
          weatherCode={weatherCode}
          temp={currentTemp}
        />

        {/* Search Bar Section */}
        <div className="mt-2 sm:mt-4">
          <SearchInputBox
            onSubmit={handleSearch}
            onLocationSearch={handleLocationSearch}
            isGeoLoading={isGeoLoading}
            currentCity={currentCity}
          />
        </div>

        {/* Non-blocking Geolocation Notice Toast */}
        {geoNotice && (
          <div className="w-full max-w-md mx-auto px-4 mt-3">
            <div className="p-2.5 rounded-xl glass-panel bg-cyan-950/60 border border-cyan-400/40 text-center text-xs font-semibold text-cyan-200 animate-fadeIn shadow-lg">
              {geoNotice}
            </div>
          </div>
        )}

        {/* Content Section: Loading, Error, or Weather Dashboard */}
        {isLoading ? (
          <WeatherSkeleton />
        ) : hasError ? (
          <ErrorState
            message={currentWeatherData.error}
            onRetry={() => handleSearch("Delhi")}
            onSelectPopular={(city) => handleSearch(city)}
          />
        ) : (
          <main className="animate-fadeIn">
            {/* Hero Current Weather Card */}
            <CurrentWeather
              currentWeatherData={currentWeatherData}
              unit={unit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={toggleFavorite}
            />

            {/* 24-Hour Hourly Timeline */}
            <HourlyForecast
              weatherForecastData={weatherForecastData}
              unit={unit}
            />

            {/* Air Quality Index (AQI) Card */}
            <AirQualityCard
              airQualityData={airQualityData}
              currentCity={currentCity}
            />

            {/* Detailed Atmospheric Conditions Grid with Interactive Sun Arc */}
            <WeatherMetrics
              currentWeatherData={currentWeatherData}
              unit={unit}
            />

            {/* Daily Lifestyle & Travel Activity Index */}
            <LifestyleIndex
              currentWeatherData={currentWeatherData}
            />

            {/* 5-Day Precision Forecast */}
            <WeatherForecast
              weatherForecastData={weatherForecastData}
              unit={unit}
            />
          </main>
        )}

        {/* Footer */}
        <footer className="w-full max-w-5xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
          <p>
            SkyCast Weather Engine • Real-Time Meteorological Intelligence for India & Global Destinations
          </p>
        </footer>
      </div>

      {/* Saved Cities / Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedCities={savedCities}
        onSelectCity={(city) => handleSearch(city)}
        onRemoveCity={removeFavorite}
        currentCity={currentCity}
      />

      {/* Compare Cities Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentCity={currentCity}
        currentWeatherData={currentWeatherData}
        unit={unit}
        onSwitchCity={(city) => handleSearch(city)}
      />
    </div>
  );
};

export default App;
