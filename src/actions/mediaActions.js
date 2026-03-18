'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinarySignatureAction(params = {}) {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Add timestamp to params for signature generation
        const signatureParams = {
            ...params,
            timestamp,
        };

        const signature = cloudinary.utils.api_sign_request(
            signatureParams,
            process.env.CLOUDINARY_API_SECRET
        );

        return {
            success: true,
            signature,
            timestamp,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        };
    } catch (error) {
        console.error('Signature Generation Error:', error);
        return { success: false, error: error.message };
    }
}
