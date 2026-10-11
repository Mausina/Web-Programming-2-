import { z } from "zod";

export const strategySchema = z.object({
  name: z.string().min(3).max(50),
  isActive: z.boolean().optional(),
  buyAmountSol: z.number().min(0.01).max(100),
  takeProfitPct: z.number().min(1).max(10000),
  stopLossPct: z.number().min(1).max(100),
  maxHoldMinutes: z.number().int().min(1).max(1440),
  isPublic: z.boolean().optional(),
});

export const snipeSchema = z.object({
  strategy: z.string().regex(/^[0-9a-fA-F]{24}$/, "strategy must be a valid id"),
  tokenName: z.string().min(1).max(50),
  tokenMint: z.string().min(32).max(44),
  amountSol: z.number().min(0.01).max(100),
  status: z.enum(["open", "closed"]).optional(),
  profitLossPct: z.number().optional(),
});
