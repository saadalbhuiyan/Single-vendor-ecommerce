import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otp: { type: String },
    isVerified: { type: Boolean, default: false },
    otpCreatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
