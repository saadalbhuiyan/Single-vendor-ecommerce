const nodemailer = require('nodemailer');

/**
 * Create and configure nodemailer transporter using SMTP.
 * Uses environment variables with fallback defaults.
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: false, // false for TLS (STARTTLS), true for SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify SMTP connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('SMTP configuration is valid and ready for sending emails.');
    }
});

module.exports = transporter;
