export interface IUser {
  _id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  loginCount: number;
}

export interface IResponse {
  error: string | null;
  data: any;
}
