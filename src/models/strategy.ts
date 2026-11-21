import { Schema, model } from "mongoose";
import { z } from "zod";

export interface IStrategy {
  name: string;
  isActive: boolean;
  buyAmountSol: number;
  takeProfitPct: number;
  stopLossPct: number;
  maxHoldMinutes: number;
  isPublic: boolean;
}

const strategySchema = new Schema<IStrategy>(
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

export const Strategy = model<IStrategy>("Strategy", strategySchema);

// Zod schemas for validating the request body (used by the validate middleware)
export const createStrategyZSchema = z.object({
  name: z.string().min(3).max(50),
  isActive: z.boolean().optional(),
  buyAmountSol: z.number().min(0.01).max(100),
  takeProfitPct: z.number().min(1).max(10000),
  stopLossPct: z.number().min(1).max(100),
  maxHoldMinutes: z.number().int().min(1).max(1440),
  isPublic: z.boolean().optional(),
});

export const updateStrategyZSchema = createStrategyZSchema;
