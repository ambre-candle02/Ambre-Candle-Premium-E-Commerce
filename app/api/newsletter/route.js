import { NextResponse } from 'next/server';
import { db } from '@/src/config/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Check if DB is initialized
        if (!db) {
            console.error("Firebase DB not initialized in newsletter API");
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }

        // Use email as doc ID for instant duplicate handling and faster writes
        const subscriberRef = doc(db, 'subscribers', email.toLowerCase().trim());

        await setDoc(subscriberRef, {
            email: email.toLowerCase().trim(),
            subscribedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });

        return NextResponse.json({ message: 'Welcome to the inner circle! Subscribed successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Newsletter API error:', error);
        return NextResponse.json({ message: 'Error joining. Please try again later.' }, { status: 500 });
    }
}
