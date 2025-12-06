import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { programCode, description } = body;
       
        const response = await fetch('http://localhost:3001/programs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ programCode, description }),
        });
        if (!response.ok) {
            throw new Error('Failed to create program');
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}