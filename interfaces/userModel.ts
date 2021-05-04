import { Document } from "mongoose";

export default interface IUserModel extends Document {
  username: string;
  password: string;
  loginCount: number;
  generateToken: () => string;
  comparePasswords: (password: string) => boolean;
}
