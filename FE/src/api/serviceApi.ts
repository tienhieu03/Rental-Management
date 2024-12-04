import { apiRequest } from "./ApiConfig";

import { RegisterServiceStatus, ServiceType } from "../enums";

import { ApiMethod } from "../enums";
const fetchServiceApi = async (query: any): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/services?${query}`, false);
};
const fetchServiceByIdApi = async (id: string): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/services/${id}`, false);
};
const deleteServiceApi = async (id: string): Promise<any> => {
  return apiRequest(ApiMethod.DELETE, `/api/v1/services/${id}`, false);
};
const postServiceApi = (
  serviceName: string,
  description: string,
  price: number,
  unit: string,
  type: ServiceType
): Promise<any> => {
  return apiRequest(ApiMethod.POST, `/api/v1/services`, false, {
    serviceName,
    description,
    price: parseInt(price.toString()),
    unit,
    type,
  });
};

const patchServiceApi = (
  id: string,
  serviceName: string,
  description: string,
  price: number,
  unit: string,
  type: ServiceType
): Promise<any> => {
  return apiRequest(ApiMethod.PATCH, `/api/v1/services/${id}`, false, {
    serviceName,
    description,
    price: parseInt(price.toString()),
    unit,
    type,
  });
};

export default {
  fetchServiceApi,
  fetchServiceByIdApi,
  deleteServiceApi,
  postServiceApi,
  patchServiceApi,

};
