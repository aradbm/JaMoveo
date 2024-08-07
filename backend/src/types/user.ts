import { Document, Model } from "mongoose";

type Instrument =
  | "guitar"
  | "bass"
  | "drums"
  | "vocals"
  | "keyboard"
  | "saxophone";

export interface IUser extends Document {
  username: string;
  password: string;
  isAdmin: boolean;
  instrument: Instrument;
}

export interface IUserModel extends Model<IUser> {
  findByUsername(username: string): Promise<IUser | null>;
}
