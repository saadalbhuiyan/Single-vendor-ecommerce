const OTP = require('../models/OTP');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const transporter = require('../config/smtpConfig');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

/**
 * Sends a One-Time Password (OTP) to the specified email address.
 * - Deletes any previous OTPs for the email.
 * - Generates a new 6-digit OTP with a 5-minute expiry.
 * - Sends OTP via configured SMTP transporter.
 * POST /api/auth/send-otp
 */
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });

        // Generate OTP and expiry time
        const otpCode = generateOTP(6);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Remove any existing OTPs for the email to avoid conflicts
        await OTP.deleteMany({ email });

        // Save new OTP record
        const otpEntry = new OTP({ email, code: otpCode, expiresAt });
        await otpEntry.save();

        // Prepare email message
        const mailOptions = {
            from: `"E-Commerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
        };

        // Send OTP email
        await transporter.sendMail(mailOptions);

        return res.json({ message: 'OTP sent to email.' });
    } catch (error) {
        console.error('sendOTP error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message || error.toString(),
        });
    }
};

/**
 * Verifies the provided OTP for the given email.
 * - Checks OTP validity and expiry.
 * - Creates a new user if not existing or verifies existing user email.
 * - Issues a JWT token upon successful verification.
 * POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required.' });
        }

        // Find OTP record
        const otpEntry = await OTP.findOne({ email, code: otp });
        if (!otpEntry) return res.status(400).json({ message: 'Invalid OTP.' });

        // Check expiry
        if (otpEntry.expiresAt < new Date()) {
            await OTP.deleteMany({ email });
            return res.status(400).json({ message: 'OTP expired.' });
        }

        // Find or create user and mark email as verified
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, isEmailVerified: true });
            await user.save();
        } else if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        // Store JWT token in user record
        user.jwtToken = token;
        await user.save();

        // Remove OTPs after successful verification
        await OTP.deleteMany({ email });

        return res.json({
            token,
            user: { id: user._id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error('verifyOTP error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Logs out the authenticated user by invalidating their stored JWT token.
 * - Expects Bearer token in Authorization header.
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) return res.status(400).json({ message: 'No token provided.' });

        const decoded = jwt.verify(token, jwtConfig.secret);

        // Find user and clear stored JWT token
        const user = await User.findById(decoded.id);
        if (user) {
            user.jwtToken = null;
            await user.save();
        }

        return res.json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error('logout error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
