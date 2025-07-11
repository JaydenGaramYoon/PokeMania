import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    playedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Game', GameSchema, 'game');