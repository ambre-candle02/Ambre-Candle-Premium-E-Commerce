import { NextResponse } from 'next/server';

export async function POST(req) {
    const { phone } = await req.json();

    if (!phone) {
        return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();


    return NextResponse.json({
        success: true,
        message: "OTP generated successfully (Simulation Mode)",

        mode: "simulation"
    }, { status: 200 });
}
