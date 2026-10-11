import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Snipe } from "../models/snipe";
import { Strategy } from "../models/strategy";
import { snipeSchema } from "../validation";

const router = express.Router();

// get all snipes (with the strategy name)
router.get("/", async (req: Request, res: Response) => {
  try {
    const snipes = await Snipe.find().populate("strategy", "name");
    res.status(200).json(snipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// get one snipe
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  try {
    const snipe = await Snipe.findById(id).populate("strategy", "name");
    if (!snipe) {
      res.status(404).json({ message: "Snipe not found" });
      return;
    }
    res.status(200).json(snipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// create a snipe
router.post("/", async (req: Request, res: Response) => {
  const result = snipeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: "Validation failed", errors: result.error.issues });
    return;
  }

  try {
    // the strategy has to exist
    const strategy = await Strategy.findById(result.data.strategy);
    if (!strategy) {
      res.status(400).json({ message: "Strategy does not exist" });
      return;
    }

    const snipe = new Snipe(result.data);
    await snipe.save();
    res.status(201).json(snipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// update a snipe (for example close it and set the profit/loss)
router.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const result = snipeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: "Validation failed", errors: result.error.issues });
    return;
  }

  try {
    const strategy = await Strategy.findById(result.data.strategy);
    if (!strategy) {
      res.status(400).json({ message: "Strategy does not exist" });
      return;
    }

    const snipe = await Snipe.findByIdAndUpdate(id, result.data, { new: true });
    if (!snipe) {
      res.status(404).json({ message: "Snipe not found" });
      return;
    }
    res.status(200).json(snipe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// delete a snipe
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  try {
    const snipe = await Snipe.findByIdAndDelete(id);
    if (!snipe) {
      res.status(404).json({ message: "Snipe not found" });
      return;
    }
    res.status(200).json({ message: "Snipe deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
