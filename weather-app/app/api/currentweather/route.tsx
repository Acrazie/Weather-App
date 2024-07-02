import { NextResponse } from "next/server";

export async function GET() {
    const Api_Key = process.env.API_KEY;
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${Api_Key}&q=London`);
    const data = await response.json();

    return NextResponse.json(data, {status: 200});
}