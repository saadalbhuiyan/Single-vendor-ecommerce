import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: String,
    otpExpiresAt: Date,
    isVerified: { type: Boolean, default: false },
    name: { type: String, default: '' },
    mobile: { type: String, default: '' },
    addresses: [addressSchema],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
