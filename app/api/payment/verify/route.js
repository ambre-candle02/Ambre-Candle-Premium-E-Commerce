import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            return NextResponse.json({ verified: true, message: 'Payment verified successfully' });
        } else {
            return NextResponse.json({ verified: false, message: 'Invalid payment signature' }, { status: 400 });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
