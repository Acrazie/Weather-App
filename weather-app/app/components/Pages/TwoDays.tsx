"use client";

import Search from "../Ui/Search";
import Todayweather from "@/app/components/Ui/TodayWeather";
import Currentweather from "../Ui/CurrentWeather";
import Cityphoto from "../Ui/Cityphoto";
import HourlyGraphs from "../Ui/TodayHourlyGraphs";
import HourlyGraphsDay3 from "../Ui/Week3DaysWeather";

export default function HomePage() {
  return (
    <section className="flex items-center justify-center min-h-max my-10">
      <div className="bg-gray-200 p-8 rounded-md shadow-lg max-w-5xl w-full">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="https://cdn.worldvectorlogo.com/logos/next-js.svg"
            alt="Next.js Logo"
            className="h-10 w-10"
          />
          <h1 className="text-2xl font-bold text-blue-600">Weather App</h1>
        </div>
        <div className="flex flex-1 mb-12 justify-center items-center">
          <Search placeholder="Search..." />
        </div>
        <Cityphoto />
        {/* <Currentweather /> */}
        {/* <Todayweather /> */}
        {/* <HourlyGraphs /> */}
        <HourlyGraphsDay3 />

      </div>
    </section>
  );
};