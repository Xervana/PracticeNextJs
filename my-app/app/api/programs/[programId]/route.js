import { NextResponse } from 'next/server';
export async function PUT(request, { params }) {
    try{
        const { programId } = params;
        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${programId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}