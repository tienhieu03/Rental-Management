import { apiRequest } from "./ApiConfig";
import { InvoiceStatus } from "../enums";
import { ApiMethod } from "../enums";
const fetchInvoiceApi = (query: string): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/invoices?${query}`, false);
};
const fetchInvoiceByIdApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/invoices/${id}`, false);
};

export const fetchInvoiceByUserId = (): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/invoices/by-user`, false);
};

const deleteInvoiceApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.DELETE, `/api/v1/invoices/${id}`, false);
};
const postInvoiceApi = (
  room: {
    _id: string;
    roomName: string;
  },
  tenant: {
    _id: string;
    name: string;
    idCard: string;
    phone: string;
  },
  service: {
    _id: string;
    name: string;
    unit: string;
    priceUnit: number;
  },
  month: string,
  description: string,
  firstIndex?: number,
  finalIndex?: number
): Promise<any> => {
  return apiRequest(ApiMethod.POST, `/api/v1/invoices`, false, {
    room,
    tenant,
    service,
    firstIndex,
    finalIndex,
    month,
    description,
  });
};
const patchInvoiceApi = (
  id: string,
  firstIndex?: number,
  finalIndex?: number
): Promise<any> => {
  return apiRequest(ApiMethod.PATCH, `/api/v1/invoices/${id}`, false, {
    firstIndex,
    finalIndex,
  });
};

const patchInvoiceStatusApi = (
  id: string,
  status: InvoiceStatus
): Promise<any> => {
  return apiRequest(ApiMethod.PATCH, `/api/v1/invoices/${id}`, false, {
    status,
  });
};
const postInvoiceStatusPaymentApi = (
  id: string,
  idInvoices: string[]
): Promise<any> => {
  return apiRequest(ApiMethod.POST, `/api/v1/pay/paymentCheck`, false, {
    id,
    idInvoices,
  });
};


export default {
  fetchInvoiceApi,
  fetchInvoiceByIdApi,
  deleteInvoiceApi,
  postInvoiceApi,
  patchInvoiceApi,
  patchInvoiceStatusApi,
  fetchInvoiceByUserId,
  postInvoiceStatusPaymentApi,
};
