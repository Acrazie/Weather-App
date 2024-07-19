'use client';

import { useState, useEffect, StrictMode } from "react";
import { useSearchParams } from "next/navigation";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type WeatherForecastHourlyData = {
  location: {
    name: string;
  };
  forecast: {
    forecastday: {
      hour: {
        time_epoch: number;
        Time: string;
        temp_c: number;
        uv: number;
        chance_of_rain: number;
        wind_kph: number;
        condition: {
          text: string;
          icon: string;
        };
      }[];
    }[];
  };
};

export default function HourlyGraphs() {
  const [weatherForecastHourlyData, setWeatherForecastHourlyData] =
    useState<WeatherForecastHourlyData | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "Lille";

  useEffect(() => {
    const fetchForecastWeatherHourlyData = async () => {
      try {
        const response = await fetch(`/api/forecastweather?query=${query}`);
        const data: WeatherForecastHourlyData = await response.json();
        setWeatherForecastHourlyData(data);
        console.log(data);
        console.log(new Date);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    fetchForecastWeatherHourlyData();
  }, [query]);

  function processChartData() {
    if (!weatherForecastHourlyData) return [];
    const hourlyData = weatherForecastHourlyData.forecast.forecastday[0].hour;
    return hourlyData.map((hour) => ({
      Time: new Date(hour.time_epoch * 1000).toLocaleTimeString([], {hour: '2-digit'}),
      Temps: hour.temp_c,
      Uv: hour.uv,
      Raining: hour.chance_of_rain,
      Wind: hour.wind_kph,
    }));
  }

  const chartData = processChartData();

  return (
    <StrictMode>
      {chartData.length > 0 && (
        <>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-black font-semibold">Temps</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="Time"/>
              <YAxis tickCount={9}>
                <Label value="°C" offset={-10} position="left" angle={-90}/>
              </YAxis>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="Temps" stroke="#8884d8" fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-black font-semibold">UV Index</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="Time" />
              <YAxis tickCount={5}/>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="Uv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-black font-semibold">Chance of Rain</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="Time" />
              <YAxis>
              <Label value="%" offset={-10} position="left" angle={-90}/>
              </YAxis>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="Raining" stroke="#ffc658" fillOpacity={1} fill="url(#colorRain)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-black font-semibold">Wind Speed</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <defs>
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="Time" />
              <YAxis type="number" tickCount={9}>
              <Label value="km/h" offset={-10} position="left" angle={-90}/>
              </YAxis>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="Wind" stroke="#ff7300" fillOpacity={1} fill="url(#colorWind)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        </>
      )}
    </StrictMode>
  );
}
