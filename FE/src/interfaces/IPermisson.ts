import { ApiMethod } from "../enums";
interface IPermission {
  _id: string;
  name: string;
  apiPath: string;
  method: ApiMethod;
  module: string;
  createdBy: {
    _id: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;

  updatedBy: {
    _id: string;
    email: string;
  };
}
export default IPermission;
