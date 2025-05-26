const sharp = require('sharp');

async function compressImage(inputPath, outputPath) {
    await sharp(inputPath)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(outputPath);
}

module.exports = { compressImage };
