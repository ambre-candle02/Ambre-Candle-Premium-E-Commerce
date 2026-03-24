/**
 * Utility to crop images from canvas coordinates
 * works with react-image-crop PixelCrop data
 */
export async function getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx || !image) {
        return null;
    }

    // Adjust for natural image dimensions (scaling factor)
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Set canvas size to the ACTUAL resolution we want based on the crop
    canvas.width = Math.floor(pixelCrop.width * scaleX);
    canvas.height = Math.floor(pixelCrop.height * scaleY);

    ctx.imageSmoothingQuality = 'high';
    ctx.imageSmoothingEnabled = true;

    // Draw image onto canvas based on crop area
    ctx.drawImage(
        image,
        Math.floor(pixelCrop.x * scaleX),
        Math.floor(pixelCrop.y * scaleY),
        Math.floor(pixelCrop.width * scaleX),
        Math.floor(pixelCrop.height * scaleY),
        0,
        0,
        canvas.width,
        canvas.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.95); // High quality
    });
}
