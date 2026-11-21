import { Router } from "express";
import { SnipeController } from "../controllers/snipes";
import { validate } from "../middleware/validate.middleware";
import { createSnipeZSchema, updateSnipeZSchema } from "../models/snipe";

const router = Router();
const controller = new SnipeController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validate(createSnipeZSchema), controller.create);
router.put("/:id", validate(updateSnipeZSchema), controller.update);
router.delete("/:id", controller.delete);

export default router;
