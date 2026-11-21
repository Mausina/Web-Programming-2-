import { Router } from "express";
import { StrategyController } from "../controllers/strategies";
import { validate } from "../middleware/validate.middleware";
import { createStrategyZSchema, updateStrategyZSchema } from "../models/strategy";

const router = Router();
const controller = new StrategyController();

// the route layer maps each HTTP request to a controller method
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validate(createStrategyZSchema), controller.create);
router.put("/:id", validate(updateStrategyZSchema), controller.update);
router.delete("/:id", controller.delete);

export default router;
