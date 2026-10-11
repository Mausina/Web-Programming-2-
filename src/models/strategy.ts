import mongoose from "mongoose";

export interface IStrategy {
  name: string;
  isActive: boolean;
  buyAmountSol: number;
  takeProfitPct: number;
  stopLossPct: number;
  maxHoldMinutes: number;
  isPublic: boolean;
}

const strategySchema = new mongoose.Schema<IStrategy>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    buyAmountSol: { type: Number, required: true },
    takeProfitPct: { type: Number, required: true },
    stopLossPct: { type: Number, required: true },
    maxHoldMinutes: { type: Number, required: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Strategy = mongoose.model<IStrategy>("Strategy", strategySchema);
