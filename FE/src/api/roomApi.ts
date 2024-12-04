import { apiConfig, apiRequest } from "./ApiConfig";
import { RoomStatus, RoomType } from "../enums";
import { ApiMethod } from "../enums";
const fetchRoomApi = (query: any): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/rooms?${query}`, false);
};
const fetchRoomByIdApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.GET, `/api/v1/rooms/${id}`, false);
};
const deleteRoomApi = (id: string): Promise<any> => {
  return apiRequest(ApiMethod.DELETE, `/api/v1/rooms/${id}`, false);
};
const postRoomApi = (
  roomName: string,
  area: number,
  type: RoomType,
  status: RoomStatus,
  price: number,
  description: string,
  services: any[]
): Promise<any> => {
  return apiRequest(ApiMethod.POST, `/api/v1/rooms`, false, {
    roomName,
    area: parseInt(area.toString()),
    type,
    status,
    price: parseInt(price.toString()),
    description,
    services,
  });
};
const patchRoomApi = (
  id: string,
  area: number,
  type: RoomType,
  status: RoomStatus,
  price: number,
  description: string,
  services: any[]
): Promise<any> => {
  return apiRequest(ApiMethod.PATCH, `/api/v1/rooms/${id}`, false, {
    area: parseInt(area.toString()),
    type,
    status,
    price: parseInt(price.toString()),
    description,
    services,
  });
};

const updateRoomStatusApi = (id: string, status: RoomStatus): Promise<any> => {
  return apiConfig.patch(`/api/v1/rooms/${id}`, {
    status,
  });
};
export default {
  fetchRoomApi,
  fetchRoomByIdApi,
  deleteRoomApi,
  postRoomApi,
  patchRoomApi,
  updateRoomStatusApi,
};
