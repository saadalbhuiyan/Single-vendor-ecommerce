import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // stored in plain text as per your requirement (NOT recommended for production)
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Admin', adminSchema);
