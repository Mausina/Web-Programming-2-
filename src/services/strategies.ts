import { HydratedDocument } from "mongoose";
import { Strategy, IStrategy } from "../models/strategy";
import { Snipe } from "../models/snipe";

// the service layer talks to the database through the Mongoose model
export class StrategyService {
  async getAll(): Promise<IStrategy[]> {
    return await Strategy.find().lean();
  }

  async getById(id: string): Promise<IStrategy | null> {
    return await Strategy.findById(id).lean();
  }

  async create(data: IStrategy): Promise<HydratedDocument<IStrategy>> {
    const strategy = new Strategy(data);
    return await strategy.save();
  }

  async update(id: string, data: Partial<IStrategy>): Promise<IStrategy | null> {
    return await Strategy.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
  }

  async delete(id: string): Promise<IStrategy | null> {
    const strategy = await Strategy.findByIdAndDelete(id).lean();
    // deleting a strategy also removes its snipes
    if (strategy) {
      await Snipe.deleteMany({ strategy: id });
    }
    return strategy;
  }
}
