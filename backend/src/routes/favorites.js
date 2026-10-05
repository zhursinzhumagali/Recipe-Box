import { Router } from 'express';
import {
    addFavorite,
    removeFavorite,
    getFavorites
} from '../controllers/favoritesController.js';

const router = Router();

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:recipeId', removeFavorite);

export default router;
