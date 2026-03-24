import { NextResponse } from 'next/server';
import { db } from '@/src/config/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, total, customer, userId, razorpay_order_id, razorpay_payment_id } = body;

        // Generate a simple, user-friendly Order ID (e.g., AMB-123456)
        const timestamp = Date.now().toString().slice(-4);
        const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
        const customOrderId = `AMB-${timestamp}${randomStr}`;

        // Save order to Firestore
        const orderData = {
            orderId: customOrderId, // Custom simple ID
            items,
            total,
            customer,
            userId: userId || 'guest',
            status: 'Processing',
            date: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            createdAt: serverTimestamp(),
            paymentInfo: {
                razorpay_order_id: razorpay_order_id || null,
                razorpay_payment_id: razorpay_payment_id || null
            }
        };

        const docRef = await addDoc(collection(db, "orders"), orderData);

        return NextResponse.json({
            success: true,
            message: 'Order created successfully!',
            orderId: customOrderId // Return the simplified ID
        });
    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { orderId, status, userId } = body;

        if (!orderId || status !== 'Cancelled') {
            return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
        }

        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        const orderData = orderSnap.data();

        // Security Check: Only the owner can cancel
        if (orderData.userId !== userId && userId !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Logic Check: Can only cancel if still Processing or Pending
        const currentStatus = orderData.status?.toLowerCase();
        if (currentStatus !== 'processing' && currentStatus !== 'pending') {
            return NextResponse.json({
                success: false,
                error: `Order cannot be cancelled because it is already ${currentStatus}.`
            }, { status: 400 });
        }

        await updateDoc(orderRef, {
            status: 'Cancelled',
            updatedAt: serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        console.error("Order Cancel Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
