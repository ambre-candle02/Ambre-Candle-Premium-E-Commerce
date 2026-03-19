import { NextResponse } from 'next/server';
import { db } from '@/src/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        if (!db) {
            console.error("Firebase DB not initialized in newsletter API");
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }

        const subscriberRef = doc(db, 'subscribers', email.toLowerCase().trim());
        await setDoc(subscriberRef, {
            email: email.toLowerCase().trim(),
            subscribedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });

        // Email logic natively run in background to make response FAST
        const sendEmailsInBackground = async () => {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.error("Nodemailer configuration is missing in .env.local!");
                return;
            }
            
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailToUser = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Welcome to the Ambre Candle Community ✨',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 30px; background: #fff; max-width: 600px; margin: auto; border: 1px solid #eee;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <h1 style="color: #d4af37; font-family: 'Times New Roman', serif; margin: 0;">Ambre Candle</h1>
                            </div>
                            <p style="color: #333; font-size: 16px;">Hello,</p>
                            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                                Thank you for joining the Ambre Candle community. You are now in the glow! <br><br>
                                Get ready to discover new scents, exclusive releases, and cozy inspiration crafted for excellence.
                            </p>
                            <p style="color: #333; font-size: 16px; margin-top: 30px;">
                                Warm Regards,<br>
                                <strong>The Ambre Candle Team</strong>
                            </p>
                        </div>
                    `,
                };

                const mailToAdmin = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: '🔥 New Newsletter Subscriber!',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="color: #d4af37;">New Subscriber Alert</h2>
                            <p>A new user just subscribed to the Stay in the Glow newsletter:</p>
                            <p style="background: #fdfbf7; padding: 10px; border-left: 3px solid #d4af37; font-weight: bold; font-size: 16px;">
                                ${email}
                            </p>
                        </div>
                    `,
                };

                await Promise.all([
                    transporter.sendMail(mailToUser).catch(e => console.error("Error sending user mail:", e)),
                    transporter.sendMail(mailToAdmin).catch(e => console.error("Error sending admin mail:", e))
                ]);
            } catch (err) {
                console.error("Background Email Error:", err);
            }
        };

        // Fire and forget (makes UI response instant)
        sendEmailsInBackground();

        return NextResponse.json({ message: 'Welcome to the inner circle! Subscribed successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Newsletter API error:', error);
        return NextResponse.json({ message: 'Error joining. Please try again later.' }, { status: 500 });
    }
}
