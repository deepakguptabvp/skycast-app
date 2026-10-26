"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Flame, Navigation, Mic, MicOff } from "lucide-react";

// Indian States and Major Metro Cities
const INDIAN_LOCATIONS = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Jaipur",
  "Ahmedabad",
  "Pune",
  "Lucknow",
  "Chandigarh",
  "Goa",
  "Srinagar",
  "Kochi",
  "Bhopal",
  "Patna",
];

const SearchInputBox = ({
  onSubmit,
  onLocationSearch,
  isGeoLoading,
  currentCity = "",
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechSupport(true);
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            // Clean up e.g. "weather in Jaipur" -> "Jaipur"
            const cleaned = transcript.replace(/weather in|weather for|weather/gi, "").trim();
            setQuery(cleaned || transcript);
            onSubmit(cleaned || transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onSubmit]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
      }
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setQuery("");
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleCitySelect = (cityName) => {
    onSubmit(cityName);
    setQuery("");
    inputRef.current?.blur();
    setIsFocused(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Search Bar Container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Main Search Input Form */}
        <form
          onSubmit={handleSubmit}
          className={`relative flex items-center flex-1 rounded-2xl glass-panel transition-all duration-300 ${
            isFocused
              ? "ring-2 ring-cyan-400/60 border-cyan-400/70 shadow-2xl shadow-cyan-500/25 bg-white/15"
              : "hover:border-white/30"
          }`}
        >
          {/* Search Icon */}
          <div className="pl-4 pr-2 text-slate-400 flex-shrink-0">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={
              isListening
                ? "Listening... Speak city name (e.g. Mumbai, Jaipur)..."
                : "Search any Indian city, state, or world destination (e.g. Delhi, Jaipur, Goa)..."
            }
            className={`w-full py-3.5 sm:py-4 bg-transparent text-white placeholder:text-slate-400 text-sm sm:text-base focus:outline-none pr-10 ${
              isListening ? "placeholder:text-cyan-300 font-medium" : ""
            }`}
          />

          {/* Voice Search Mic Button inside input */}
          {hasSpeechSupport && (
            <button
              type="button"
              onClick={toggleVoiceSearch}
              title={isListening ? "Stop listening" : "Search by voice"}
              className={`p-2 mr-1 rounded-xl transition-all flex-shrink-0 ${
                isListening
                  ? "bg-rose-500/30 text-rose-300 ring-2 ring-rose-400 animate-pulse"
                  : "text-slate-400 hover:text-cyan-300 hover:bg-white/10"
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-rose-400" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors mr-2 flex-shrink-0"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Action Button inside on small */}
          <button
            type="submit"
            className="flex sm:hidden items-center justify-center p-2.5 mr-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 flex-shrink-0"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Buttons Row: My Location & Search (Desktop) */}
        <div className="flex items-center gap-2">
          {/* Enhanced "My Location" GPS Button */}
          <button
            type="button"
            onClick={onLocationSearch}
            disabled={isGeoLoading}
            title="Detect my live GPS / IP location"
            className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl glass-panel transition-all duration-200 text-xs sm:text-sm font-semibold flex-1 sm:flex-initial whitespace-nowrap ${
              isGeoLoading
                ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/40 animate-pulse"
                : "hover:bg-cyan-500/20 hover:border-cyan-400/50 text-slate-100 hover:text-cyan-200 active:scale-95"
            }`}
          >
            <Navigation
              className={`w-4 h-4 text-cyan-400 ${
                isGeoLoading ? "animate-spin" : ""
              }`}
            />
            <span>{isGeoLoading ? "Detecting GPS..." : "My Location"}</span>
          </button>

          {/* Submit Search Button (Desktop) */}
          <button
            type="button"
            onClick={handleSubmit}
            className="hidden sm:flex items-center gap-1.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Indian Popular Cities / States Chips */}
      <div className="mt-3.5">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold tracking-wide">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Top Indian Cities & States:</span>
          </div>
        </div>

        {/* Horizontal Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 custom-scrollbar scroll-smooth">
          {INDIAN_LOCATIONS.map((loc) => {
            const isSelected = currentCity.toLowerCase() === loc.toLowerCase();
            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleCitySelect(loc)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 border border-cyan-300/40 scale-105"
                    : "glass-panel-subtle hover:bg-white/15 text-slate-200 hover:text-white border border-white/10 hover:border-white/25 active:scale-95"
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? "text-white" : "text-cyan-400"}`} />
                {loc}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchInputBox;
