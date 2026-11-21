import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserService } from "../services/users";

const userService = new UserService();

export class UserController {
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    try {
      const user = await userService.getById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const exists = await userService.existsByEmailOrUsername(req.body.email, req.body.username);
      if (exists) {
        res.status(409).json({ message: "Email or username already in use" });
        return;
      }
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.verifyLogin(req.body.email, req.body.password);
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    try {
      const user = await userService.delete(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };
}
