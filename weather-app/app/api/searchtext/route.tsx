import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const ApiKey = process.env.GOOGLE_API_KEY;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'Lille';
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?&key=${ApiKey}&inputtype=textquery&fields=photo&input=${query}`);
    const data = await response.json();

    return NextResponse.json(data, {status: 200});
}