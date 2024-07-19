"use client";

import { useState, useEffect, StrictMode } from "react";
import { useSearchParams } from "next/navigation";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type HourlyData = {
  Time: string;
  Temps: number;
  Uv: number;
  Raining: number;
  Wind: number;
};

type WeatherForecastHourlyData = {
  location: {
    name: string;
  };
  forecast: {
    forecastday: {
      date: string;
      hour: {
        time_epoch: number;
        time: string;
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

export default function HourlyGraphsDay3() {
  const [weatherForecastHourlyData, setWeatherForecastHourlyData] =
    useState<WeatherForecastHourlyData | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "Lille";
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  useEffect(() => {
    const fetchForecastWeatherHourlyData = async () => {
      try {
        const response = await fetch(`/api/forecastweather?query=${query}`);
        const data: WeatherForecastHourlyData = await response.json();
        setWeatherForecastHourlyData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    fetchForecastWeatherHourlyData();
  }, [query]);

  function processChartData(dayOffset: number): HourlyData[] {
    if (!weatherForecastHourlyData) return [];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const targetDateString = targetDate.toISOString().split("T")[0];

    const targetDayData = weatherForecastHourlyData.forecast.forecastday.find(
      (day) => day.date === targetDateString
    );

    if (!targetDayData) return [];

    return targetDayData.hour.map((hour) => ({
      Time: new Date(hour.time_epoch * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      Temps: hour.temp_c,
      Uv: hour.uv,
      Raining: hour.chance_of_rain,
      Wind: hour.wind_kph,
    }));
  }

  const chartDataPlus1 = processChartData(1);
  const chartDataPlus2 = processChartData(2);

  const renderChart = (
    chartData: HourlyData[],
    title: string,
    dataKey: keyof HourlyData,
    stroke: string,
    fill: string
  ) => (
    <div className="flex flex-col justify-center items-center">
      <h2 className="font-semibold">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stroke} stopOpacity={0.8} />
              <stop offset="95%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="Time" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            fillOpacity={1}
            fill={`url(#color${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderGraphSet = (chartData: HourlyData[], date: string) => (
    <div>
      <h1 className="font-bold text-xl">{date}</h1>
      {renderChart(
        chartData,
        "Temperature",
        "Temps",
        "#8884d8",
        "url(#colorTemp)"
      )}
      {renderChart(chartData, "Uv Index", "Uv", "#82ca9d", "url(#colorUv)")}
      {renderChart(
        chartData,
        "Chance of Rain",
        "Raining",
        "#ffc658",
        "url(#colorRain)"
      )}
      {renderChart(
        chartData,
        "Wind Speed",
        "Wind",
        "#ff7300",
        "url(#colorWind)"
      )}
    </div>
  );

  const targetDatePlus1 = new Date();
  targetDatePlus1.setDate(targetDatePlus1.getDate() + 1);
  const dateStringPlus1 = targetDatePlus1.toISOString().split("T")[0];

  const targetDatePlus2 = new Date();
  targetDatePlus2.setDate(targetDatePlus2.getDate() + 2);
  const dateStringPlus2 = targetDatePlus2.toISOString().split("T")[0];

  return (
    <StrictMode>
      <div className="flex flex-1 justify-center items-center">
        <button
          className="text-center w-fit mb-4 px-4 py-2 rounded-md bg-blue-500 text-white hover:scale-105 hover:bg-blue-400"
          onClick={() => setIsVisible1(!isVisible1)}
          >
          {isVisible1 ? "Hide" : "Show"} Day + 1
        </button>
          </div>
        {isVisible1 &&
          chartDataPlus1.length > 0 &&
          renderGraphSet(chartDataPlus1, dateStringPlus1)}
      <div className="flex flex-1 justify-center items-center">
        <button
          className="mb-4 px-4 py-2 rounded-md bg-blue-500 text-white hover:scale-105 hover:bg-blue-400"
          onClick={() => setIsVisible2(!isVisible2)}
        >
          {isVisible2 ? "Hide" : "Show"} Day + 2
        </button>
        </div>
        {isVisible2 &&
          chartDataPlus2.length > 0 &&
          renderGraphSet(chartDataPlus2, dateStringPlus2)}
    </StrictMode>
  );
}
