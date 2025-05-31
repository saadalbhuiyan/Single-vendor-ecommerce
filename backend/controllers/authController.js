const OTP = require('../models/OTP');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const transporter = require('../config/smtpConfig');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

/**
 * Send OTP to the provided email address.
 * Generates a 6-digit OTP, stores it with expiration,
 * deletes previous OTPs for that email, and emails the code.
 */
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email presence
        if (!email) return res.status(400).json({ message: 'Email is required.' });

        // Generate 6-digit OTP
        const otpCode = generateOTP(6);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        // Remove any previous OTP entries for this email
        await OTP.deleteMany({ email });

        // Save new OTP entry
        const otpEntry = new OTP({ email, code: otpCode, expiresAt });
        await otpEntry.save();

        // Email options
        const mailOptions = {
            from: `"E-Commerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
        };

        // Send email with OTP
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
 * Verify OTP for the given email.
 * Checks OTP validity and expiration,
 * creates or updates user verification status,
 * generates JWT token for authenticated session.
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input presence
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required.' });
        }

        // Find OTP record matching email and code
        const otpEntry = await OTP.findOne({ email, code: otp });
        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Check if OTP expired
        if (otpEntry.expiresAt < new Date()) {
            // Cleanup expired OTPs
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

        // Generate JWT token for user session
        const token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        // Save token to user record (optional; consider stateless JWT)
        user.jwtToken = token;
        await user.save();

        // Remove OTP records after successful verification
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
 * Logout user by invalidating JWT token stored in user record.
 * Token expected in Authorization header as Bearer token.
 */
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) return res.status(400).json({ message: 'No token provided.' });

        // Verify token and extract payload
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Find user and clear token to logout
        const user = await User.findById(decoded.id);
        if (user) {
            user.jwtToken = null;
            await user.save();
        }

        return res.json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error('logout error:', error);

        // Handle token verification errors explicitly
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
