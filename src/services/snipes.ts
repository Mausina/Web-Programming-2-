import { HydratedDocument } from "mongoose";
import { Snipe, ISnipe } from "../models/snipe";
import { Strategy } from "../models/strategy";

export class SnipeService {
  async getAll(): Promise<ISnipe[]> {
    // include the name of the strategy each snipe belongs to
    return await Snipe.find().populate("strategy", "name").lean();
  }

  async getById(id: string): Promise<ISnipe | null> {
    return await Snipe.findById(id).populate("strategy", "name").lean();
  }

  async strategyExists(id: string): Promise<boolean> {
    const strategy = await Strategy.findById(id).lean();
    return strategy !== null;
  }

  async create(data: ISnipe): Promise<HydratedDocument<ISnipe>> {
    const snipe = new Snipe(data);
    return await snipe.save();
  }

  async update(id: string, data: Partial<ISnipe>): Promise<ISnipe | null> {
    return await Snipe.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
  }

  async delete(id: string): Promise<ISnipe | null> {
    return await Snipe.findByIdAndDelete(id).lean();
  }
}
