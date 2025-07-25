import mongoose from 'mongoose';

const FavouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pokemonId: {
        type: Number,
        required: true
    },
    memo: {
        type: String,
        default: ''
    }
});

export default mongoose.model('Favourites', FavouriteSchema);