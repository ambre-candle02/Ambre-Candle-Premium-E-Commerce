import { NextResponse } from 'next/server';

export async function POST(req) {
    const { phone } = await req.json();

    if (!phone) {
        return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Simulation: Log OTP to server console
    console.log(`[AUTH] SMS OTP FOR ${phone}: ${otp}`);

    return NextResponse.json({
        success: true,
        message: "OTP generated successfully (Simulation Mode)",
        otp: otp, // Sending back so you can see it in the alert during testing
        mode: "simulation"
    }, { status: 200 });
}
