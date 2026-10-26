// Temperature conversion
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

export const formatTemp = (celsius, unit = "metric") => {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return "--";
  const temp = unit === "metric" ? celsius : celsiusToFahrenheit(celsius);
  return `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`;
};

// Wind speed formatting (OpenWeather returns meters/sec in metric)
export const formatWindSpeed = (speedMs, unit = "metric") => {
  if (speedMs === undefined || speedMs === null || isNaN(speedMs)) return "--";
  if (unit === "metric") {
    // Convert m/s to km/h
    return `${Math.round(speedMs * 3.6)} km/h`;
  } else {
    // Convert m/s to mph
    return `${Math.round(speedMs * 2.23694)} mph`;
  }
};

// Visibility formatting (meters to km or miles)
export const formatVisibility = (meters, unit = "metric") => {
  if (meters === undefined || meters === null || isNaN(meters)) return "--";
  if (unit === "metric") {
    const km = meters / 1000;
    return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
  } else {
    const miles = meters / 1609.34;
    return `${miles >= 10 ? Math.round(miles) : miles.toFixed(1)} mi`;
  }
};

// Wind direction degrees to compass cardinal direction
export const getWindDirection = (degrees) => {
  if (degrees === undefined || degrees === null) return "N";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
};

// Format local time using city's timezone offset (in seconds)
export const formatLocalTime = (unixTimestamp, timezoneOffsetSeconds = 0) => {
  if (!unixTimestamp) return "";
  // UTC milliseconds + offset milliseconds
  const localDate = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  return localDate.toUTCString().slice(17, 22); // "HH:MM"
};

// Format local time with AM/PM
export const formatLocalTime12h = (unixTimestamp, timezoneOffsetSeconds = 0) => {
  if (!unixTimestamp) return "";
  const localDate = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  let hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesFormatted} ${ampm}`;
};

// Format local date
export const formatLocalDate = (unixTimestamp, timezoneOffsetSeconds = 0) => {
  if (!unixTimestamp) return "";
  const localDate = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${weekdays[localDate.getUTCDay()]}, ${months[localDate.getUTCMonth()]} ${localDate.getUTCDate()}`;
};

export const getDayFromTimestamp = (unixTimestamp, timezoneOffsetSeconds = 0) => {
  if (!unixTimestamp) return "";
  const localDate = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[localDate.getUTCDay()];
};

export const getShortDayFromTimestamp = (unixTimestamp, timezoneOffsetSeconds = 0) => {
  if (!unixTimestamp) return "";
  const localDate = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[localDate.getUTCDay()];
};

// Dynamic Theme detection based on weather condition and day/night
export const getWeatherTheme = (weatherCode, icon = "", temp = 25) => {
  const isNight = icon.endsWith("n");

  if (isNight) {
    return {
      gradient: "from-slate-950 via-indigo-950 to-slate-900",
      cardBg: "bg-slate-900/60 border-slate-700/40",
      accent: "text-indigo-400",
      badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      glow: "rgba(99, 102, 241, 0.2)",
      status: "night",
    };
  }

  // Hot weather / High Indian Summer: temp >= 32°C
  if (temp >= 32) {
    return {
      gradient: "from-orange-950 via-amber-950 to-slate-950",
      cardBg: "bg-orange-950/40 border-orange-800/30",
      accent: "text-amber-300",
      badge: "bg-orange-500/25 text-amber-200 border-orange-500/40",
      glow: "rgba(245, 158, 11, 0.3)",
      status: "hot",
    };
  }

  // Thunderstorm: 2xx
  if (weatherCode >= 200 && weatherCode < 300) {
    return {
      gradient: "from-slate-950 via-purple-950 to-gray-950",
      cardBg: "bg-purple-950/40 border-purple-800/30",
      accent: "text-amber-400",
      badge: "bg-purple-500/25 text-purple-200 border-purple-500/40",
      glow: "rgba(168, 85, 247, 0.25)",
      status: "thunderstorm",
    };
  }

  // Drizzle (3xx) & Rain (5xx)
  if (weatherCode >= 300 && weatherCode < 600) {
    return {
      gradient: "from-sky-950 via-blue-950 to-slate-950",
      cardBg: "bg-blue-950/40 border-blue-800/30",
      accent: "text-cyan-400",
      badge: "bg-cyan-500/25 text-cyan-200 border-cyan-500/40",
      glow: "rgba(6, 182, 212, 0.25)",
      status: "rain",
    };
  }

  // Snow: 6xx
  if (weatherCode >= 600 && weatherCode < 700) {
    return {
      gradient: "from-slate-900 via-teal-950 to-cyan-950",
      cardBg: "bg-teal-950/40 border-teal-800/30",
      accent: "text-cyan-300",
      badge: "bg-cyan-500/20 text-cyan-200 border-cyan-500/30",
      glow: "rgba(34, 211, 238, 0.2)",
      status: "snow",
    };
  }

  // Atmosphere (Mist, Smoke, Haze, Fog): 7xx
  if (weatherCode >= 700 && weatherCode < 800) {
    return {
      gradient: "from-zinc-950 via-stone-900 to-slate-950",
      cardBg: "bg-stone-900/40 border-stone-700/40",
      accent: "text-stone-300",
      badge: "bg-stone-500/20 text-stone-300 border-stone-500/30",
      glow: "rgba(168, 162, 158, 0.15)",
      status: "mist",
    };
  }

  // Clear: 800
  if (weatherCode === 800) {
    return {
      gradient: "from-blue-700 via-sky-800 to-slate-950",
      cardBg: "bg-white/12 border-white/20",
      accent: "text-amber-300",
      badge: "bg-amber-400/25 text-amber-200 border-amber-300/40",
      glow: "rgba(251, 191, 36, 0.25)",
      status: "clear",
    };
  }

  // Clouds: 801-804
  return {
    gradient: "from-slate-900 via-blue-950 to-slate-950",
    cardBg: "bg-white/10 border-white/15",
    accent: "text-sky-300",
    badge: "bg-sky-500/20 text-sky-200 border-sky-400/30",
    glow: "rgba(56, 189, 248, 0.2)",
    status: "clouds",
  };
};

// Generates contextual smart advice
export const getSmartWeatherAdvice = (currentWeather) => {
  if (!currentWeather) return null;
  const temp = currentWeather.main?.temp;
  const condition = currentWeather.weather?.[0]?.main?.toLowerCase() || "";
  const wind = currentWeather.wind?.speed || 0;
  const humidity = currentWeather.main?.humidity || 0;

  if (condition.includes("rain") || condition.includes("drizzle")) {
    return {
      icon: "umbrella",
      title: "Precipitation Alert",
      text: "Rain expected today. Don't forget your umbrella and waterproof gear!",
      type: "rain",
    };
  }

  if (condition.includes("thunderstorm")) {
    return {
      icon: "zap",
      title: "Thunderstorm Warning",
      text: "Lightning and stormy conditions reported. Stay indoors when possible.",
      type: "storm",
    };
  }

  if (condition.includes("snow")) {
    return {
      icon: "snowflake",
      title: "Winter Conditions",
      text: "Snowfall detected. Watch for icy surfaces and wear insulated layers.",
      type: "snow",
    };
  }

  if (temp <= 5) {
    return {
      icon: "thermometer-snowflake",
      title: "Chilly Temperatures",
      text: "It's freezing cold outside. Bundle up with warm coats, gloves, and a beanie.",
      type: "cold",
    };
  }

  if (temp >= 32) {
    return {
      icon: "sun",
      title: "High Heat Advisory",
      text: "Hot weather ahead. Stay well hydrated, seek shade, and apply sunscreen.",
      type: "hot",
    };
  }

  if (wind >= 10) {
    return {
      icon: "wind",
      title: "Breezy & Windy",
      text: "Gusty winds today. Secure loose outdoor items and hold onto your hats!",
      type: "wind",
    };
  }

  if (humidity >= 85) {
    return {
      icon: "droplets",
      title: "High Humidity",
      text: "Air feels damp and heavy. Keep cool and ventilated.",
      type: "humidity",
    };
  }

  return {
    icon: "smile",
    title: "Pleasant Weather",
    text: `Comfortable conditions in ${currentWeather.name}. Great day for outdoor activities!`,
    type: "pleasant",
  };
};

// Extract hourly forecast for the next 24 hours (8 points of 3-hour forecasts)
export const getHourlyForecast = (forecastList = [], timezoneOffset = 0) => {
  if (!Array.isArray(forecastList) || forecastList.length === 0) return [];
  return forecastList.slice(0, 8).map((item) => ({
    dt: item.dt,
    dt_txt: item.dt_txt,
    time: formatLocalTime12h(item.dt, timezoneOffset),
    temp: item.main?.temp,
    feels_like: item.main?.feels_like,
    icon: item.weather?.[0]?.icon,
    description: item.weather?.[0]?.description,
    pop: Math.round((item.pop || 0) * 100), // probability of precipitation %
    wind: item.wind?.speed,
    humidity: item.main?.humidity,
  }));
};

// Extract 5-day daily forecast aggregating high/low and conditions
export const getFiveDayForecast = (forecastList = [], timezoneOffset = 0) => {
  if (!Array.isArray(forecastList) || forecastList.length === 0) return [];

  const daysMap = {};

  forecastList.forEach((entry) => {
    // Group by local date string
    const localDate = new Date((entry.dt + timezoneOffset) * 1000);
    const dateKey = localDate.toISOString().split("T")[0];

    if (!daysMap[dateKey]) {
      daysMap[dateKey] = {
        dateKey,
        dt: entry.dt,
        minTemp: entry.main?.temp_min,
        maxTemp: entry.main?.temp_max,
        icons: [entry.weather?.[0]?.icon],
        descriptions: [entry.weather?.[0]?.description],
        entries: [entry],
        pops: [entry.pop || 0],
      };
    } else {
      daysMap[dateKey].minTemp = Math.min(daysMap[dateKey].minTemp, entry.main?.temp_min);
      daysMap[dateKey].maxTemp = Math.max(daysMap[dateKey].maxTemp, entry.main?.temp_max);
      daysMap[dateKey].entries.push(entry);
      daysMap[dateKey].pops.push(entry.pop || 0);
      daysMap[dateKey].icons.push(entry.weather?.[0]?.icon);
      daysMap[dateKey].descriptions.push(entry.weather?.[0]?.description);
    }
  });

  // Convert map to array and format
  const result = Object.values(daysMap).slice(0, 5).map((day) => {
    // Pick middle of the day entry or first entry for icon
    const middayEntry =
      day.entries.find((e) => {
        const h = new Date((e.dt + timezoneOffset) * 1000).getUTCHours();
        return h >= 11 && h <= 15;
      }) || day.entries[Math.floor(day.entries.length / 2)];

    const maxPop = Math.round(Math.max(...day.pops) * 100);

    return {
      dateKey: day.dateKey,
      dt: middayEntry.dt,
      dayName: getDayFromTimestamp(middayEntry.dt, timezoneOffset),
      shortDay: getShortDayFromTimestamp(middayEntry.dt, timezoneOffset),
      formattedDate: formatLocalDate(middayEntry.dt, timezoneOffset),
      minTemp: day.minTemp,
      maxTemp: day.maxTemp,
      icon: middayEntry.weather?.[0]?.icon,
      description: middayEntry.weather?.[0]?.description,
      pop: maxPop,
      humidity: middayEntry.main?.humidity,
      windSpeed: middayEntry.wind?.speed,
      hourlyEntries: day.entries,
    };
  });

  return result;
};
