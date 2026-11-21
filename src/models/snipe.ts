import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";

// a snipe is a fake (paper) buy of a token made by a strategy
export interface ISnipe {
  strategy: mongoose.Types.ObjectId;
  tokenName: string;
  tokenMint: string;
  amountSol: number;
  status: string;
  profitLossPct: number;
}

const snipeSchema = new Schema<ISnipe>(
  {
    strategy: { type: Schema.Types.ObjectId, ref: "Strategy", required: true },
    tokenName: { type: String, required: true },
    tokenMint: { type: String, required: true },
    amountSol: { type: Number, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    profitLossPct: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Snipe = model<ISnipe>("Snipe", snipeSchema);

// Zod schemas for validating the request body (used by the validate middleware)
export const createSnipeZSchema = z.object({
  strategy: z.string().regex(/^[0-9a-fA-F]{24}$/, "strategy must be a valid id"),
  tokenName: z.string().min(1).max(50),
  tokenMint: z.string().min(32).max(44),
  amountSol: z.number().min(0.01).max(100),
  status: z.enum(["open", "closed"]).optional(),
  profitLossPct: z.number().optional(),
});

export const updateSnipeZSchema = createSnipeZSchema;
