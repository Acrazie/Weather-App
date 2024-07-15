import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const ApiKey = process.env.API_KEY;
    const { searchParams } = new URL (req.url);
    const query = searchParams.get('query') || 'Lille';
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${query}&days=3`);
    const data = await response.json();

    return NextResponse.json(data, {status: 200});
}