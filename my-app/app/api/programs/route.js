// GET, POST, PUT

import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const body = await request.json();

        const {programcode, description } = body;
    
        const payload = {programcode, description};

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/All`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
