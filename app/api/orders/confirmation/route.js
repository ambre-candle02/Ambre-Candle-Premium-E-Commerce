import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { order, type } = await req.json();

        if (!order || !order.customer || !order.customer.email) {

            return NextResponse.json({ message: 'Invalid order data' }, { status: 400 });
        }



        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Email API Error: EMAIL_USER or EMAIL_PASS environment variables are missing");
            return NextResponse.json({ message: 'Email configuration missing' }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Test the connection
        try {
            await transporter.verify();

        } catch (verifyError) {
            console.error("Nodemailer Verify Error:", verifyError);
            throw verifyError;
        }

        // Determine Subject and Message based on type
        let subject = `Order Confirmed - #${order.id} | Ambre Candle`;
        let statusTitle = "Order Successfully Placed!";
        let trackingInfo = "";
        let messageBody = "We have received your order and are currently processing it.";

        // Handle Status Updates
        switch (type) {
            case 'packed':
                subject = `Your Order #${order.id} is Packed! | Ambre Candle`;
                statusTitle = "Packed with Care ✨";
                messageBody = "Good news! Your order has been carefully packed and is ready to be shipped.";
                break;

            case 'shipped':
            case 'tracking': // Backward compatibility
                subject = `Your Order #${order.id} has been Shipped! | Ambre Candle`;
                statusTitle = "Your Order is on its way! 🚚";
                messageBody = "Your package has been handed over to our courier partner.";
                trackingInfo = `
                <div style="background: #fdfbf7; padding: 20px; border-radius: 12px; border: 1px solid #d4af37; margin-bottom: 25px;">
                    <h3 style="margin-top: 0; color: #d4af37;">Tracking Details</h3>
                    <p><strong>AWB Number:</strong> ${order.trackingID || 'Pending'}</p>
                    <p><strong>Carrier:</strong> Delhivery Global</p>
                    ${order.trackingID ? `<a href="https://www.delhivery.com/track/package/${order.trackingID}" 
                       style="display: inline-block; background: #d4af37; color: #fff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
                       Track Your Package ↗
                    </a>` : ''}
                </div>
            `;
                break;

            case 'delivered':
                subject = `Order Delivered - #${order.id} | Ambre Candle`;
                statusTitle = "Package Delivered! 🎁";
                messageBody = "Your order has been delivered. We hope it brings warmth and light to your space!";
                break;
        }

        const itemsHtml = order.items.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <div>
                   <p style="margin: 0; font-weight: bold;">${item.name} x ${item.quantity}</p>
                </div>
                <p style="margin: 0; font-weight: bold;">₹${item.price * item.quantity}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: `"Ambre Candle" <${process.env.EMAIL_USER}>`,
            to: order.customer.email,
            subject: subject,
            html: `
                <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; padding: 30px; color: #1a1a1a; background: #fff; border: 1px solid #eee; border-radius: 20px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="color: #d4af37; margin: 0; font-size: 2rem;">Ambre Candle</h1>
                        <p style="letter-spacing: 3px; font-size: 0.8rem; text-transform: uppercase;">The Art of Fragrance</p>
                    </div>

                    <h2 style="font-size: 1.5rem; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 20px;">${statusTitle}</h2>
                    
                    <p>Hi ${order.customer.firstName},</p>
                    <p>Thank you for shopping with Ambre Candle! ${messageBody}</p>
                    
                    <div style="margin: 30px 0;">
                        <p><strong>Order ID:</strong> #${order.id}</p>
                        <p><strong>Date:</strong> ${order.date}</p>
                    </div>

                    ${trackingInfo}

                    <div style="margin-bottom: 30px;">
                        <h3 style="font-size: 1.1rem; color: #d4af37; margin-bottom: 15px;">Order Summary</h3>
                        ${itemsHtml}
                        <div style="display: flex; justify-content: space-between; padding-top: 15px; font-size: 1.2rem; font-weight: bold;">
                            <span>Total</span>
                            <span style="color: #d4af37;">₹${order.total}</span>
                        </div>
                    </div>

                    <div style="background: #fdfbf7; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                        <h3 style="margin-top: 0; color: #d4af37; font-size: 1rem;">Shipping Address</h3>
                        <p style="margin: 0;">${order.customer.firstName} ${order.customer.lastName}</p>
                        <p style="margin: 5px 0 0;">${order.customer.address}</p>
                        <p style="margin: 5px 0 0;">${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
                        <p style="margin: 5px 0 0;">Phone: ${order.customer.phone}</p>
                    </div>

                    <div style="text-align: center; color: #888; font-size: 0.85rem;">
                        <p>If you have any questions, feel free to reply to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} Ambre Candle. All rights reserved.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
    }
}
