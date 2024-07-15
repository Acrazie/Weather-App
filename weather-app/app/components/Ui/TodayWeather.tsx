"use client";

import { useState, useEffect, StrictMode } from "react";
import { useSearchParams } from "next/navigation";

type WeatherForecastData = {
  location: {
    name: string;
  };
  forecast: {
    forecastday: {
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        daily_chance_of_rain: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
        };
        uv: number;
      };
      astro: {
        sunrise: number;
        sunset: number;
        moon_phase: string;
      };
    }[];
  };
};

export default function Todayweather() {
  const [weatherForecastData, setWeatherForecastData] =
    useState<WeatherForecastData | null>(null);
  const [isVisible1, setIsVisible1] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "Lille";

  useEffect(() => {
    const fetchForecastWeatherData = async () => {
      try {
        const response = await fetch(`/api/forecastweather?query=${query}`);
        const data: WeatherForecastData = await response.json();
        setWeatherForecastData(data);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    Promise.all([fetchForecastWeatherData()]);
  }, [query]);

  return (
    <StrictMode>
      <div className="flex flex-1 justify-center items-center pt-4">
        <button
          onClick={() => setIsVisible1(!isVisible1)}
          className="mb-4 px-4 py-2 rounded-md bg-blue-500 text-white hover:scale-105 hover:bg-blue-400"
        >
          {isVisible1 ? "Hide Today Weather" : "Show Today Weather"}
        </button>
      </div>
      <div
        className={`flex justify-between p-4 transition-all duration-500 bg-blue-100 ${
          isVisible1
            ? "opacity-100 max-h-full"
            : "opacity-0 max-h-0 overflow-hidden hidden"
        }`}
      >
        <div className="flex flex-col items-center justify-center w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <div>
            <text className="font-normal">Temps</text>
          </div>
          <div className="flex flex-1 justify-between items-start w-full">
            <text className="flex flex-col justify-between items-center">
              Min
              <text>
                {weatherForecastData
                  ? `${weatherForecastData.forecast.forecastday[0].day.mintemp_c} °`
                  : "Loading..."}
              </text>
            </text>
            <text className="flex flex-col justify-between items-center">
              Avg
              <text>
                {weatherForecastData
                  ? `${weatherForecastData.forecast.forecastday[0].day.avgtemp_c} °`
                  : "Loading..."}
              </text>
            </text>
            <text className="flex flex-col justify-between items-center">
              Max
              <text>
                {weatherForecastData
                  ? `${weatherForecastData.forecast.forecastday[0].day.maxtemp_c} °`
                  : "Loading..."}
              </text>
            </text>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-1/5 mx-1 px-4 pb-2 rounded-md bg-blue-500 text-white">
          {weatherForecastData && (
            <img
              src={
                weatherForecastData.forecast.forecastday[0].day.condition.icon
              }
              alt={
                weatherForecastData.forecast.forecastday[0].day.condition.text
              }
              className="w-10 h-10"
            />
          )}
          {weatherForecastData
            ? `${weatherForecastData.forecast.forecastday[0].day.condition.text}`
            : "Loading..."}
        </div>
        <div className=" flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <text className="font-normal">UV</text>
          {weatherForecastData
            ? `${weatherForecastData.forecast.forecastday[0].day.uv}`
            : "Loading..."}
        </div>
        <div className=" flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <text className="font-normal">Rain Percentage</text>
          {weatherForecastData
            ? `${weatherForecastData.forecast.forecastday[0].day.daily_chance_of_rain}%`
            : "Loading..."}
        </div>
        <div className=" flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <text className="font-normal">Snow Percentage</text>
          {weatherForecastData
            ? `${weatherForecastData.forecast.forecastday[0].day.daily_chance_of_snow}%`
            : "Loading..."}
        </div>
      </div>
      <div
        className={`flex justify-center p-4 transition-all duration-500 bg-blue-100 ${
          isVisible1
            ? "opacity-100 max-h-full"
            : "opacity-0 max-h-0 overflow-hidden hidden"
        }`}
      >
        <div className=" flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <text className="font-normal">Sunrise</text>
          {weatherForecastData
            ? `${weatherForecastData.forecast.forecastday[0].astro.sunrise}`
            : "Loading..."}
        </div>
        <div className=" flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <text className="font-normal">Sunset</text>
          {weatherForecastData
            ? `${weatherForecastData.forecast.forecastday[0].astro.sunset}`
            : "Loading..."}
        </div>
        <div className=" flex flex-col items-center justify-evenly w-1/5 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
          <text className="font-normal">Moon Phase </text>
          {weatherForecastData
            ? `${weatherForecastData.forecast.forecastday[0].astro.moon_phase}`
            : "Loading..."}
        </div>
      </div>
    </StrictMode>
  );
}
