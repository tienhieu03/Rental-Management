import { RegisterServiceStatus, RoomType, ServiceType } from "../enums";

interface IRegisterService {
  _id: string;
  service: {
    _id: string;
    serviceName: string;
    description: string;
    price: number;
    unit: string;
    type: ServiceType;
  };
  user: {
    _id: string;
    email: string;
    name: string;
    phone: string;
    idCard: string;
    birthday: Date;
    avatar: string;
  };
  room: {
    _id: string;
    roomName: string;
    type: RoomType;
  };
  status: RegisterServiceStatus;
  type: boolean;
  executeNow: boolean;
  implementationDate: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    _id: string;
    email: string;
    name: string;
  };
  updatedBy: {
    _id: string;
    email: string;
    name: string;
  };
}
export default IRegisterService;
