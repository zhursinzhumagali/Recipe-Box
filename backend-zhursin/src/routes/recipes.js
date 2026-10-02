import { Router } from 'express';

import fakeAuth from '../middleware/fakeAuth.js';

import {
    createRecipe,
    updateRecipe,
    deleteRecipe
} from '../controllers/recipesController.js';

const router = Router();

router.post('/', fakeAuth, createRecipe);
router.put('/:id', fakeAuth, updateRecipe);
router.delete('/:id', fakeAuth, deleteRecipe);

export default router;