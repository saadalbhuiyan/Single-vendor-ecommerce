import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image files are allowed!'), false);
    } else {
        cb(null, true);
    }
};

export const uploadProductImages = multer({
    storage,
    fileFilter,
    limits: { files: 5 },
}).array('images', 5);

export const uploadImages = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
    }

    const uploadDir = path.resolve('uploads/products');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    try {
        const imagePaths = [];
        for (const file of req.files) {
            const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
            const filepath = path.join(uploadDir, filename);

            await sharp(file.buffer)
                .resize({ width: 800, withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(filepath);

            imagePaths.push(`/uploads/products/${filename}`);
        }
        req.body.images = imagePaths;
        next();
    } catch (err) {
        next(err);
    }
};
