import { ServiceType } from "../enums";
 interface IService {
  _id: string;
  serviceName: string;
  description: string;
  price: string;
  unit: string;
  type: ServiceType;
  createdBy: {
    _id: string;
    email: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;

  updatedBy: {
    _id: string;
    email: string;
    name: string;
  };
}
export default IService;
