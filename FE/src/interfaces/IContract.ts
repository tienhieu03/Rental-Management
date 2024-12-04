import { ContractStatus } from "../enums";
interface IContract {
  _id: string;
  room: {
    _id: string;
    roomName: string;

    price: number;
  };
  tenant: {
    _id: string;
    name: string;
    idCard: string;
    phone: string;
    email: string;
    address: string;
  };
  innkeeper: {
    _id: string;
    name: string;
  };
  startDate: Date;
  endDate: Date;
  depositAmount: number;
  status: ContractStatus;
  rentCycleCount: number;
  actualEndDate: Date;
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
  address: string;
}
export default IContract;
