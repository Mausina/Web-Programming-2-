import mongoose from "mongoose";

// a snipe is a fake (paper) buy of a token made by a strategy
export interface ISnipe {
  strategy: mongoose.Types.ObjectId;
  tokenName: string;
  tokenMint: string;
  amountSol: number;
  status: string;
  profitLossPct: number;
}

const snipeSchema = new mongoose.Schema<ISnipe>(
  {
    strategy: { type: mongoose.Schema.Types.ObjectId, ref: "Strategy", required: true },
    tokenName: { type: String, required: true },
    tokenMint: { type: String, required: true },
    amountSol: { type: Number, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    profitLossPct: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Snipe = mongoose.model<ISnipe>("Snipe", snipeSchema);
