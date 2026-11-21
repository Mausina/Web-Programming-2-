import { Router } from "express";
import { UserController } from "../controllers/users";
import { validate } from "../middleware/validate.middleware";
import { registerZSchema, loginZSchema } from "../models/user";

const router = Router();
const controller = new UserController();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validate(registerZSchema), controller.register);
router.post("/login", validate(loginZSchema), controller.login);
router.delete("/:id", controller.delete);

export default router;
