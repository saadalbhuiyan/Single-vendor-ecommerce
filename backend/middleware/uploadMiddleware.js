const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the uploads directory path
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists; create if not
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // recursive: true for nested dirs safety
}

// Configure multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

// Initialize multer upload middleware
const upload = multer({ storage });

module.exports = upload;
