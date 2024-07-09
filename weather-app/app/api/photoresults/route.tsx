import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const ApiKey = process.env.GOOGLE_API_KEY;
    const { searchParams } = new URL(req.url);
    const photoReference = searchParams.get('photo_reference');
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?key=${ApiKey}&photoreference=${photoReference}&maxwidth=400&maxheight=400`)
    const photoUrl = response.url;

    return NextResponse.json({ photoUrl }, {status: 200});
}