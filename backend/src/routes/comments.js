import { Router } from 'express';
import { getComments, addComment } from '../controllers/commentsController.js';

const router = Router({ mergeParams: true });

router.get('/', getComments);
router.post('/', addComment);

export default router;
