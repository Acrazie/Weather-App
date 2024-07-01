'use client'
import Image from "next/image";

export default function HomePage() {
    return (
      <section className="flex items-center justify-center min-h-screen bg-blue-100   ">
        <div className="bg-gray-100 p-8 rounded-md shadow-lg max-w-lg w-full    ">
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src="https://cdn.worldvectorlogo.com/logos/next-js.svg"
              alt=""
              className="h-10 w-10q"
            />
            <h1 className="text-2xl font-bold text-blue-600">Weather App</h1>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search a city"
              className="w-full px-4 py-2 rounded-md bg-blue-500 text-white placeholder: placeholder-white border"
            />
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-32 h-32 bg-white border rounded-md">
                <Image src="" alt="" />
              </div>
              <p className="mt-4 px-4 py-2 rounded-md bg-blue-500 text-white">
                Name of the city
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button className="w-1/3 mx-1 px-4 py-2 rounded-md bg-blue-500 text-white">
              Infos
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
}