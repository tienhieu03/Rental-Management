import { apiRequest } from "./ApiConfig";
import { ApiMethod } from "../enums";
const fecthAccountApi = async (query: any): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/users?${query}`, false);
};
const fetchAccountByIdApi = async (id: string): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/users/${id}`, false);
};
const deleteAcountApi = async (id: string): Promise<any> => {
  return apiRequest(ApiMethod.DELETE, `/api/v1/users/${id}`, false);
};
const postAccountApi = (
  email: string,
  phone: number,
  password: string,
  name: string,
  birthday: Date,
  gender: string,
  address: string,
  idCard: string,
  role: string,
  avatar: string,
  imagesIdCard: string[]

): Promise<any> => {
    return apiRequest(ApiMethod.POST, `/api/v1/users`, false, {
        email,
        phone,
        password,
        name,
        birthday,
        gender,
        address,
        idCard,
        role: role,
        imagesIdCard,
        avatar,
    });
};

const patchAccountApi = (
  id: string,


    phone: number,

    name: string,
    birthday: Date,
    gender: string,
    address: string,
    idCard: string,
    role: string,
    avatar: string,
    imagesIdCard: string[]
): Promise<any> => {
    return apiRequest(ApiMethod.PATCH, `/api/v1/users/${id}`, false, {
        phone,
        name,
        birthday,
        gender,
        address,
        idCard,
        role,
        imagesIdCard,
        avatar,
    });
};

const changePasswordApi = (
  _id: string,
  password: string,
  oldPassword: string

): Promise<any> => {
    return apiRequest(ApiMethod.POST, `/api/v1/users/change-password`, false, {
        _id,
        password,
        oldPassword,
    });
};
export default {
  fecthAccountApi,
  deleteAcountApi,
  postAccountApi,
  patchAccountApi,
  changePasswordApi,
  fetchAccountByIdApi,
};
