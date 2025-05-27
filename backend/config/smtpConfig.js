const nodemailer = require('nodemailer');

/**
 * Create and configure the SMTP transporter using environment variables.
 * Defaults to Gmail SMTP server if environment variables are not set.
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: false, // Use TLS for port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Verify SMTP configuration to ensure transporter is ready to send emails.
 */
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('SMTP configuration is valid and ready for sending emails.');
    }
});

module.exports = transporter;
