import { Schema, model } from "mongoose";
import { z } from "zod";

// a user owns strategies and snipes. the password is stored only as a bcrypt hash
export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select: false means the hash is not returned by queries unless asked for explicitly
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);

// Zod schemas for validating the request body (used by the validate middleware)
export const registerZSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginZSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
