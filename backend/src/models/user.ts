import mongoose, { Schema } from "mongoose";
import { IUser, IUserModel } from "../types/user";

const UserSchema = new Schema({
  isAdmin: { type: Boolean, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  instrument: { type: String, required: true },
});

UserSchema.statics.findByUsername = async function (
  username: string
): Promise<IUser | null> {
  return this.findOne({ username });
};

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
