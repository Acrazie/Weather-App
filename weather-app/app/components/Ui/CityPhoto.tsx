'use client'

import { StrictMode } from "react"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";


export default function Cityphoto() {

    type WeatherData = {
        location: {
          name: string;
        };
      };

      type PlaceData = {
        candidates: {
          photos: {
            photo_reference: string;
          }[];
        }[];
      };
    
      const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
      const [placeData, setPlaceData] = useState<PlaceData | null>(null);
      const [photoUrl, setPhotoUrl] = useState<string | null>(null);
      const searchParams = useSearchParams();
      const query = searchParams.get("query") || "Lille";
    
      useEffect(() => {

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
            const response = await fetch(
              `/api/photoresults?photo_reference=${photoReference}`
            );
            const data = await response.json();
            setPhotoUrl(data.photoUrl);
          } catch (error) {
            console.error("Error fetching photo:", error);
          }
        };

        const fetchWeatherData = async () => {
          try {
            const response = await fetch(`/api/currentweather?query=${query}`);
            const data: WeatherData = await response.json();
            setWeatherData(data);
          } catch (error) {
            console.error("Error fetching weather data:", error);
          }
        };


    
        Promise.all([
          fetchWeatherData(),
          fetchPlaceData(),
        ]);
        }, [query]);

    return(
        <StrictMode>
            <div className="flex items-center justify-center mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center overflow-hidden w-42 h-42 bg-white border rounded-md">
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Photo"
                  className="shrink-0 min-w-full min-h-full"
                />
              )}
            </div>
            <p className="mt-4 px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
              {weatherData ? weatherData.location.name : "Loading..."}
            </p>
          </div>
        </div>
        </StrictMode>
    )
}