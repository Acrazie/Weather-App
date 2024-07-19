import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const ApiKey = process.env.GOOGLE_API_KEY;
    const { searchParams } = new URL(req.url);
    const input = searchParams.get('input');

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${ApiKey}&input=${input}&types=(cities)`);
    const data = await response.json();

    return NextResponse.json(data, {status: 200});
}