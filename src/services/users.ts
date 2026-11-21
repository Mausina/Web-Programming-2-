import bcrypt from "bcryptjs";
import { User, IUser } from "../models/user";

export interface SafeUser {
  _id: unknown;
  username: string;
  email: string;
}

export class UserService {
  async getAll(): Promise<IUser[]> {
    // passwordHash is select:false, so it is never returned here
    return await User.find().lean();
  }

  async getById(id: string): Promise<IUser | null> {
    return await User.findById(id).lean();
  }

  async existsByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const user = await User.findOne({ $or: [{ email }, { username }] }).lean();
    return user !== null;
  }

  async register(data: { username: string; email: string; password: string }): Promise<IUser> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = new User({ username: data.username, email: data.email, passwordHash });
    const saved = await user.save();

    // never return the hash
    const safe = saved.toObject();
    delete (safe as { passwordHash?: string }).passwordHash;
    return safe as IUser;
  }

  async verifyLogin(email: string, password: string): Promise<SafeUser | null> {
    // passwordHash is select:false, so request it explicitly here
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return null;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return null;
    }
    return { _id: user._id, username: user.username, email: user.email };
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).lean();
  }
}
