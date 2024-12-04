import { apiRequest } from "./ApiConfig";
import { ApiMethod } from "../enums";
const apiRegister = (
  email: string,
  phone: string,
  password: string,
  name: string,
  birthday: Date,
  gender: string,
  address: string,
  idCard: string
): Promise<any> => {
  return apiRequest(ApiMethod.POST, "/api/v1/auth/register", false, {
    email,
    phone,
    password,
    name,
    birthday,
    gender,
    address,
    idCard,
    avatar: "",
    imagesIdCard: ["", "", ""],
  });
};
const apiLogin = (username: string, password: string): Promise<any> => {
  return apiRequest(ApiMethod.POST, "/api/v1/auth/login", false, {
    username,
    password,
  });
};
const apiFetchUser = (): Promise<any> => {
  return apiRequest(ApiMethod.GET, "/api/v1/auth/account", false);
};
const apiLogout = (): Promise<any> => {
  return apiRequest(ApiMethod.POST, "/api/v1/auth/logout", false);
};
const apiActiveAccount = (_id: string, codeId: string): Promise<any> => {
  return apiRequest(ApiMethod.POST, "/api/v1/auth/check-code", false, {
    _id,
    codeId,
  });
};
const retryCode = (email: string): Promise<any> => {
  return apiRequest(ApiMethod.POST, "/api/v1/auth/retry-code", false, {
    email,
  });
};
const apiResetPassword = (
  _id: string,
  codeId: string,
  password: string
): Promise<any> => {
  return apiRequest(ApiMethod.POST, "/api/v1/auth/reset-password", false, {
    _id,
    codeId,
    password,
  });
};
export default {
  apiRegister,
  apiLogin,
  apiFetchUser,
  apiLogout,
  apiActiveAccount,
  retryCode,
  apiResetPassword,
};
