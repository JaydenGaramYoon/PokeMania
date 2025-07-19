import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bannerUrl: {
        type: String,
        default: ''
    },
    iconUrl: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    summary: {
        type: String,
        default: ''
    },
    types: [{
        type: String
    }],
    details: [{
        type: String
    }]
}, { timestamps: true });

export default mongoose.model('Profile', ProfileSchema, 'profile');