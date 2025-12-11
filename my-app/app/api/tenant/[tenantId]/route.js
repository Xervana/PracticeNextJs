import { NextResponse } from "next/server";


export async function GET(tenantId){
    try{
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/payment?payment=" + tenantId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    }
    catch(error){
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

