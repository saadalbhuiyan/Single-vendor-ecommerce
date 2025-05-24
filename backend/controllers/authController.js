import User from '../models/User.js';
import { sendOTPEmail } from '../utils/otpEmail.js';
import jwt from 'jsonwebtoken';

const OTP_EXPIRATION_MINUTES = 5;

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const sendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const otp = generateOTP();
        const otpCreatedAt = new Date();

        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpCreatedAt, isVerified: false },
            { upsert: true, new: true }
        );

        await sendOTPEmail(email, otp);

        return res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = new Date();
        const diffMinutes = (now - user.otpCreatedAt) / 1000 / 60;
        if (diffMinutes > OTP_EXPIRATION_MINUTES) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpCreatedAt = null;
        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        return res.status(200).json({ message: 'OTP verified', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'OTP verification failed' });
    }
};

export const logout = (req, res) => {
    return res.status(200).json({ message: 'Logged out successfully' });
};
