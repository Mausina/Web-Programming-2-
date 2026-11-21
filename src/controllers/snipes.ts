import { Request, Response } from "express";
import mongoose from "mongoose";
import { SnipeService } from "../services/snipes";

const snipeService = new SnipeService();

export class SnipeController {
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const snipes = await snipeService.getAll();
      res.status(200).json(snipes);
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
      const snipe = await snipeService.getById(id);
      if (!snipe) {
        res.status(404).json({ message: "Snipe not found" });
        return;
      }
      res.status(200).json(snipe);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // the body is validated by middleware, but the referenced strategy must also exist
      const exists = await snipeService.strategyExists(req.body.strategy);
      if (!exists) {
        res.status(400).json({ message: "Strategy does not exist" });
        return;
      }
      const snipe = await snipeService.create(req.body);
      res.status(201).json(snipe);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    try {
      const exists = await snipeService.strategyExists(req.body.strategy);
      if (!exists) {
        res.status(400).json({ message: "Strategy does not exist" });
        return;
      }
      const snipe = await snipeService.update(id, req.body);
      if (!snipe) {
        res.status(404).json({ message: "Snipe not found" });
        return;
      }
      res.status(200).json(snipe);
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
      const snipe = await snipeService.delete(id);
      if (!snipe) {
        res.status(404).json({ message: "Snipe not found" });
        return;
      }
      res.status(200).json({ message: "Snipe deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };
}
