import * as mongoose from "mongoose";

export default interface IUserModel extends mongoose.Document {
  username: string;
  password: string;
  loginCount: number;
  generateToken: () => string;
  comparePasswords: (password: string) => boolean;
}
