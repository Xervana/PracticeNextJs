import { NextResponse } from 'next/server';
export async function PUT(request, {params})
{
    try{

        const {industryId} = params;

        const body = await request.json();

        const response = await fetch(`http://localhost:3001/industry?industryid=${industryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    }
    catch(error){
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } 
}