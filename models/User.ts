import * as mongoose from "mongoose";
import IUserModel from "../interfaces/userModel";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    loginCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUserModel>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.generateToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "10m",
    algorithm: "HS256",
  });
};

UserSchema.methods.comparePasswords = async function (password: string) {
  // @ts-ignore
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUserModel>("user", UserSchema);
