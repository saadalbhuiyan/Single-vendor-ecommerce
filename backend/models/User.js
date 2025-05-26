const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    jwtToken: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
