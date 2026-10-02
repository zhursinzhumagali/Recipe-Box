import { Router } from "express";
import { rateRecipe } from "../controllers/ratings_controller.js";

const router = Router({ mergeParams: true });
router.post("/", rateRecipe);

export default router;