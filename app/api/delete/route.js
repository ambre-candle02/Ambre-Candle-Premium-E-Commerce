import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const { public_id } = await request.json();

        if (!public_id) {
            return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok' || result.result === 'not_found') {
            return NextResponse.json({ success: true, result });
        } else {
            console.error('Cloudinary destroy failure:', result);
            return NextResponse.json({ error: 'Deletion failed', details: result }, { status: 500 });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
