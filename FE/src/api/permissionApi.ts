import { apiRequest } from "./ApiConfig";
import { ApiMethod } from "../enums";
const fetchPermissionApi = (query: any): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/permissions?${query}`, false);
};
const fetchPermissionByIdApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/permissions/${id}`, false);
};
const postPermissionApi = (
  name: string,
  apiPath: string,
  method: ApiMethod,
  module: string
): Promise<any> => {
  return apiRequest(ApiMethod.POST, "/api/v1/permissions", false, {
    name,
    apiPath,
    method,
    module,
  });
};
const patchPermissionApi = (
  id: string,
  name: string,
  apiPath: string,
  method: ApiMethod,
  module: string
): Promise<any> => {
  return apiRequest(ApiMethod.PATCH, `/api/v1/permissions/${id}`, false, {
    name,
    apiPath,
    method,
    module,
  });
};
const deletePermissionApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.DELETE, `/api/v1/permissions/${id}`, false);
};
export default {
  fetchPermissionApi,
  fetchPermissionByIdApi,
  postPermissionApi,
  patchPermissionApi,
  deletePermissionApi,
};
