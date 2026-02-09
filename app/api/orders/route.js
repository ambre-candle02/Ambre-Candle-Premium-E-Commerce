import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, total, customer } = body;
        // In a real app, you would save this to a database (MongoDB/PostgreSQL)

        return NextResponse.json({
            success: true,
            message: 'Order created successfully!',
            orderId: 'AMB-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
