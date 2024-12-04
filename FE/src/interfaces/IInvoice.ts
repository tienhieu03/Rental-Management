import { InvoiceStatus } from "../enums";
interface IInvoice {
  _id: string;
  room: {
    _id: string;
    roomName: string;
  };
  tenant: {
    _id: string;
    name: string;
    idCard: string;
    phone: string;
  };
  service: {
    _id: string;
    name: string;
    unit: string;
    priceUnit: number;
  };
  firstIndex?: number;
  finalIndex?: number;
  totalNumber?: number;
  month: string; //(10-2024)
  description: string;
  amount: number;
  status: InvoiceStatus;
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


export default IInvoice;
