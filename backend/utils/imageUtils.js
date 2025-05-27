const sharp = require('sharp');

/**
 * Compresses an image and saves it in WebP format.
 * The image is resized to 800px width and quality is set to 80.
 *
 * @param {string} inputPath - The path to the input image.
 * @param {string} outputPath - The path where the compressed image should be saved.
 */
async function compressImage(inputPath, outputPath) {
    try {
        // Resize the image to 800px width and compress to WebP format with 80 quality
        await sharp(inputPath)
            .resize(800)  // Resize the width to 800px, maintaining aspect ratio
            .webp({ quality: 80 })  // Convert to WebP with 80% quality
            .toFile(outputPath);  // Save the compressed image to the output path
    } catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Image compression failed');
    }
}

module.exports = { compressImage };
