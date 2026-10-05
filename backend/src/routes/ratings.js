import { Router } from 'express';
import { rateRecipe } from '../controllers/ratingsController.js';

const router = Router({ mergeParams: true });

router.post('/', rateRecipe);

export default router;
