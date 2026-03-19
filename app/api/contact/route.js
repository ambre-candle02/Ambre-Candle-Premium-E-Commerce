import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/src/config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req) {
    try {
        const { firstName, lastName, email, subject, message } = await req.json();

        // Save to Firebase Database quickly
        if (db) {
            try {
                await addDoc(collection(db, 'support_queries'), {
                    firstName,
                    lastName,
                    email,
                    subject,
                    message,
                    status: 'pending',
                    createdAt: serverTimestamp()
                });
            } catch (dbError) {
                console.error("Error saving to Firebase:", dbError);
            }
        } else {
            console.error("Firebase DB not initialized in contact API");
        }

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

                // 1. Email to Admin
                const mailOptionsAdmin = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER, // Sending to yourself
                    subject: `New Contact Form Submission: ${subject} from ${firstName} ${lastName}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #d4af37;">New Message from Ambre Candle Website</h2>
                            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Subject:</strong> ${subject}</p>
                            <hr />
                            <p><strong>Message:</strong></p>
                            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37;">${message}</p>
                        </div>
                    `,
                };

                // 2. Auto-reply Email to User
                const mailOptionsUser = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: `We've received your message: ${subject}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 30px; background: #fff; max-width: 600px; margin: auto; border: 1px solid #eee;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <h1 style="color: #d4af37; font-family: 'Times New Roman', serif; margin: 0;">Ambre Candle</h1>
                            </div>
                            <p style="color: #333; font-size: 16px;">Dear ${firstName},</p>
                            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                                Thank you for reaching out to us. This is an automated confirmation that we have received your message regarding <strong>"${subject}"</strong>.
                            </p>
                            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                                Our support team is reviewing your inquiry and will get back to you as soon as possible.
                            </p>
                            <p style="color: #333; font-size: 16px; margin-top: 30px;">
                                Warm Regards,<br>
                                <strong>Ambre Candle Support Team</strong>
                            </p>
                        </div>
                    `,
                };

                // Send both emails concurrently in background
                await Promise.all([
                    transporter.sendMail(mailOptionsAdmin).catch(e => console.error("Admin Email Error:", e)),
                    transporter.sendMail(mailOptionsUser).catch(e => console.error("User Email Error:", e))
                ]);
            } catch (err) {
                console.error("Background Email Error in Contact:", err);
            }
        };

        // Fire and forget (makes UI response instant)
        sendEmailsInBackground();

        return NextResponse.json({ message: 'Request processed instantly' }, { status: 200 });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}
