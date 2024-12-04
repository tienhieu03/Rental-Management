import  { apiRequest } from "./ApiConfig";
import { ApiMethod, ContractStatus } from "../enums";
const fetchContractApi = (query: any): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/contracts?${query}`, false);
};
const fetchContractByIdApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/contracts/${id}`, false);
};
const deleteContractApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.DELETE, `/api/v1/contracts/${id}`, false);
};
const postContractApi = (
  room: {
    _id: string;
    roomName: string;
    price: number;
  },
  tenant: {
    _id: string;
    name: string;
    idCard: string;
    phone: string;
    email: string;
    address: string;
  },
  startDate: Date,
  endDate: Date,
  address: string,
  depositAmount: number,
  rentCycleCount: number,
  status: ContractStatus
): Promise<any> => {
  return apiRequest(ApiMethod.POST, `/api/v1/contracts`, false, {
    room,
    tenant,

    startDate,
    endDate,
    address,
    depositAmount,
    status,
    rentCycleCount: parseInt(rentCycleCount.toString()),
  });
};

const patchContractApi = (
  id: string,

  status: ContractStatus
): Promise<any> => {
  return apiRequest(ApiMethod.PATCH, `/api/v1/contracts/${id}`, false, {
    status,
  });
};
export default {
  fetchContractApi,
  fetchContractByIdApi,
  deleteContractApi,
  postContractApi,
  patchContractApi,
};
