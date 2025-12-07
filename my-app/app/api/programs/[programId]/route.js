import { NextResponse } from 'next/server';
export async function PUT(request, { params }) {
    try {
        const { programId } = params;
        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${programId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const body = await request.json();

        const reponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await reponse.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
