import { Request, Response } from "express";
import mongoose from "mongoose";
import { StrategyService } from "../services/strategies";

const strategyService = new StrategyService();

// the controller extracts data from the request, calls the service and builds the HTTP response
export class StrategyController {
  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const strategies = await strategyService.getAll();
      res.status(200).json(strategies);
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
      const strategy = await strategyService.getById(id);
      if (!strategy) {
        res.status(404).json({ message: "Strategy not found" });
        return;
      }
      res.status(200).json(strategy);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // the body has already been validated by the validate middleware
      const strategy = await strategyService.create(req.body);
      res.status(201).json(strategy);
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
      const strategy = await strategyService.update(id, req.body);
      if (!strategy) {
        res.status(404).json({ message: "Strategy not found" });
        return;
      }
      res.status(200).json(strategy);
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
      const strategy = await strategyService.delete(id);
      if (!strategy) {
        res.status(404).json({ message: "Strategy not found" });
        return;
      }
      res.status(200).json({ message: "Strategy deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };
}
