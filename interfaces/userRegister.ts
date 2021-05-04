export default interface IUserRegister extends Document {
  username: string;
  password: string;
  confirmPassword: string;
}
