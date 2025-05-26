const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Plain text as per request; not recommended for production
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
