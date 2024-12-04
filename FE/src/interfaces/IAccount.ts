import { Gender } from "../enums";
interface IAccount {
  _id: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  idCard: number;
  birthday: Date;
  role: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  imagesIdCard: string [];
  avatar: string;
  gender: Gender;
  address: string;
  createdAt: Date;

  updatedAt: Date;
  createdBy: {
    _id: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    email: string;
  };
}
export default IAccount;

