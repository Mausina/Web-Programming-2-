import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Strategy } from "../models/strategy";
import { Snipe } from "../models/snipe";
import { strategySchema } from "../validation";

const router = express.Router();

// get all strategies
router.get("/", async (req: Request, res: Response) => {
  try {
    const strategies = await Strategy.find();
    res.status(200).json(strategies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// get one strategy
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  try {
    const strategy = await Strategy.findById(id);
    if (!strategy) {
      res.status(404).json({ message: "Strategy not found" });
      return;
    }
    res.status(200).json(strategy);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// create a strategy
router.post("/", async (req: Request, res: Response) => {
  const result = strategySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: "Validation failed", errors: result.error.issues });
    return;
  }

  try {
    const strategy = new Strategy(result.data);
    await strategy.save();
    res.status(201).json(strategy);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// update a strategy
router.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const result = strategySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: "Validation failed", errors: result.error.issues });
    return;
  }

  try {
    const strategy = await Strategy.findByIdAndUpdate(id, result.data, { new: true });
    if (!strategy) {
      res.status(404).json({ message: "Strategy not found" });
      return;
    }
    res.status(200).json(strategy);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// delete a strategy (and its snipes)
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  try {
    const strategy = await Strategy.findByIdAndDelete(id);
    if (!strategy) {
      res.status(404).json({ message: "Strategy not found" });
      return;
    }
    await Snipe.deleteMany({ strategy: id });
    res.status(200).json({ message: "Strategy deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
