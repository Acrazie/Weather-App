'use client'

import { useState, useEffect } from "react";
import Search from "../Ui/Search";
import { useSearchParams } from "next/navigation";
type WeatherData = {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
  };
};

type PlaceData = {
  candidates: {
    photos: {
      photo_reference: string;
    }[];
  }[];
};

const HomePage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || 'Lille';

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

    const fetchPlaceData = async () => {
      try {
        const response = await fetch(`/api/searchtext?query=${query}`);
        const data: PlaceData = await response.json();
        const photoReference = data.candidates[0].photos[0].photo_reference;
        fetchPhoto(photoReference);
      } catch (error) {
        console.error("Error fetching place data", error);
      }
    };

    const fetchPhoto = async (photoReference: string) => {
      try {
        const response = await fetch(`/api/photoresults?photo_reference=${photoReference}`);
        const data = await response.json();
        setPhotoUrl(data.photoUrl);
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    };

    Promise.all([fetchWeatherData(), fetchPlaceData()]);
  }, [query]);

  return (
    <section className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-gray-100 p-8 rounded-md shadow-lg max-w-lg w-full">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="https://cdn.worldvectorlogo.com/logos/next-js.svg"
            alt="Next.js Logo"
            className="h-10 w-10"
          />
          <h1 className="text-2xl font-bold text-blue-600">Weather App</h1>
        </div>
        <div className="mb-12">
          <Search placeholder="Search..." />
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center overflow-hidden w-42 h-42 bg-white border rounded-md">
              {photoUrl && (
                <img src={photoUrl} alt="Photo" className="shrink-0 min-w-full min-h-full" />
              )}
            </div>
            <p className="mt-4 px-4 py-2 rounded-md bg-blue-500 text-white">
              {weatherData ? weatherData.location.name : 'Loading...'}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button className="w-1/3 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white">
            {weatherData ? `${weatherData.current.temp_c}°` : 'Loading...'}
          </button>
          <button className="w-1/3 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white">
            Infos
          </button>
          <button className="w-1/3 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white">
            Infos
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
