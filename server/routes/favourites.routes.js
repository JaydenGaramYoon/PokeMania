import express from 'express';
import favouritesController from '../controllers/favourites.controller.js';

const router = express.Router();

router.post('/api/favourites', favouritesController.createFavourite); // POST /api/favourites

// GET /api/favourites
router.get('/api/favourites', favouritesController.listFavourites); // GET /api/favourites

router.get('/api/favourites/:favouriteId', favouritesController.getFavouritesById); // GET /api/favourites/:favouriteId

// GET /api/favourites/:userId
router.get('/api/favourites/users/:userId', favouritesController.getFavouritesByUser);

router.delete('/api/favourites/:userId/:pokemonId', favouritesController.removeFavouriteById);

export default router;