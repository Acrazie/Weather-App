"use client";

import { StrictMode, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function Currentweather() {
  type WeatherData = {
    location: {
      name: string;
    };
    current: {
      temp_c: number;
      wind_kph: number;
      wind_degree: number;
      wind_dir: string;
      condition: {
        icon: string;
        text: string;
      };
      uv: number;
    };
  };

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "Lille";
  const weatherDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`/api/currentweather?query=${query}`);
        const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    Promise.all([fetchWeatherData()]);
  }, [query]);

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
    if (!isVisible && weatherDivRef.current) {
      weatherDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <StrictMode>
      <div className="flex flex-1 justify-center items-center">
        <button
          onClick={handleButtonClick}
          className="mb-4 px-4 py-2 rounded-md bg-blue-500 text-white hover:scale-105 hover:bg-blue-400"
        >
          {isVisible ? "Hide Current Weather" : "Show Current Weather"}
        </button>
      </div>
      <div
        ref={weatherDivRef}
        className={`flex justify-between p-4 transition-all duration-500 bg-blue-100 ${
          isVisible
            ? "opacity-100 max-h-full"
            : "opacity-0 max-h-0 overflow-hidden hidden"
        }`}
      >
        <div className="flex flex-col items-center justify-center w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <span className="font-normal">Temps</span>
          {weatherData ? `${weatherData.current.temp_c}°` : "Loading..."}
        </div>
        <div className="flex flex-col items-center justify-center w-1/5 mx-1 px-4 pb-2 rounded-md bg-blue-500 text-white">
          {weatherData && (
            <img
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
              className="w-10 h-10"
            />
          )}
          {weatherData ? `${weatherData.current.condition.text}` : "Loading..."}
        </div>
        <div className="flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <span className="font-normal">UV</span>
          {weatherData ? `${weatherData.current.uv}` : "Loading..."}
        </div>
        <div className="flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <span className="font-normal">Wind</span>
          {weatherData ? `${weatherData.current.wind_kph}km/h` : "Loading..."}
        </div>
        <div className="flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <span className="font-normal">Wind Direction</span>
          <div className="flex flex-1 flex-row justify-evenly items-center w-full">
            <img
              src="right-arrow.png"
              alt="Arrow"
              className="w-6 h-6"
              style={{
                transform: `rotate(${weatherData?.current.wind_degree}deg)`,
              }}
            />
            <span>
              {weatherData
                ? `${weatherData.current.wind_degree}°`
                : "Loading..."}
            </span>
            <span>
              {weatherData ? `${weatherData.current.wind_dir}` : "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </StrictMode>
  );
}