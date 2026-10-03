import { Router } from "express";
import { getComments, addComment } from "../controllers/comments_controller.js";

const router = Router({ mergeParams: true });
router.get("/", getComments);
router.post("/", addComment);

export default router;