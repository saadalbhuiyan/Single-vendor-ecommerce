const OTP = require('../models/OTP');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const transporter = require('../config/smtpConfig');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otpCode = generateOTP(6);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        await OTP.deleteMany({ email });

        const otpEntry = new OTP({ email, code: otpCode, expiresAt });
        await otpEntry.save();

        const mailOptions = {
            from: `"E-Commerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('sendOTP error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message || error.toString(),
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const otpEntry = await OTP.findOne({ email, code: otp });
        if (!otpEntry) return res.status(400).json({ message: 'Invalid OTP' });

        if (otpEntry.expiresAt < new Date()) {
            await OTP.deleteMany({ email });
            return res.status(400).json({ message: 'OTP expired' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, isEmailVerified: true });
            await user.save();
        } else if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        user.jwtToken = token;
        await user.save();

        await OTP.deleteMany({ email });

        return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        console.error('verifyOTP error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (!token) return res.status(400).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, jwtConfig.secret);
        const user = await User.findById(decoded.id);
        if (user) {
            user.jwtToken = null;
            await user.save();
        }
        return res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('logout error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
