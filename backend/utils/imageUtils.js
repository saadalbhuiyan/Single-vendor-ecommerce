const sharp = require('sharp');

/**
 * Compresses and resizes an image to 800px width and converts it to WebP format.
 * @param {string} inputPath - Path to the input image file.
 * @param {string} outputPath - Path where the compressed image will be saved.
 * @throws Throws error if compression fails.
 */
async function compressImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize(800) // Resize width to 800px, height auto
            .webp({ quality: 80 }) // Convert to WebP with quality 80
            .toFile(outputPath);
    } catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Image compression failed');
    }
}

module.exports = { compressImage };
