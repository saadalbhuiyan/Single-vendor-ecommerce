import User from '../models/User.js';
import { sendOTPEmail } from '../utils/otpEmail.js';
import jwt from 'jsonwebtoken';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        let user = await User.findOne({ email });

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (!user) {
            user = new User({ email, otp, otpExpiresAt });
        } else {
            user.otp = otp;
            user.otpExpiresAt = otpExpiresAt;
        }

        await user.save();

        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ message: 'OTP verified', token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
};

export const logout = async (req, res) => {
    // For JWT, logout on client side by deleting token.
    // Optionally, implement token blacklist on server for invalidation.
    res.json({ message: 'Logout successful (client-side token discard)' });
};
