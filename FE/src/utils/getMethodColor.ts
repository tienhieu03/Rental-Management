import {
  ApiMethod,
  ContractStatus,
  Gender,
  InvoiceStatus,
  RoomStatus,
  RoomType,
  ServiceType,
} from "../enums";

export const getMethodColor = (method: ApiMethod) => {
  switch (method) {
    case ApiMethod.GET:
      return "green";
    case ApiMethod.POST:
      return "yellow";
    case ApiMethod.PATCH:
      return "purple";
    case ApiMethod.DELETE:
      return "red";
    default:
      return "gray";
  }
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case "SUPER ADMIN":
      return " text-red-600";
    case "NORMAL USER":
      return " text-green-600";
    default:
      return "text-blue-600";
  }
};
export const getRoomStatusColor = (status: string) => {
  switch (status) {
    case RoomStatus.Available:
      return "text-green-600 ";
    case RoomStatus.Occupied:
      return "text-yellow-600 ";
  }
};
export const getRoomTypeColor = (type: string) => {
  switch (type) {
    case RoomType.Single:
      return "orange-600 ";
    case RoomType.Double:
      return "purple-600 ";
    case RoomType.Quad:
      return "blue-600 ";
    case RoomType.Studio:
      return "pink-600 ";
  }
};

export const getServiceTypeColor = (type: string) => {
  switch (type) {
    case ServiceType.Electricity:
      return "text-orange-600 ";
    case ServiceType.Water:
      return "text-blue-600 ";
    case ServiceType.Internet:
      return "text-purple-600 ";
    case ServiceType.Other:
      return "text-pink-600 ";
  }
};
export const getContractStatusColor = (status: string) => {
  switch (status) {
    case ContractStatus.ACTIVE:
      return "text-green-600 ";
    case ContractStatus.CANCELED:
      return "text-red-600 ";
    case ContractStatus.EXPIRED:
      return "text-orange-600 ";
  }
};
export const getInvoiceStatusColor = (status: string) => {
  switch (status) {
    case InvoiceStatus.PAID:
      return "text-green-600 ";
    case InvoiceStatus.UNPAID:
      return "text-red-600 ";
  }
};
export const getGenderColor = (gender: string) => {
  switch (gender) {
    case Gender.Male:
      return "text-blue-600 ";
    case Gender.Female:
      return "text-pink-600 ";
    default:
      return "text-purple-600 ";
  }
};

export const getRequestServiceTypeColor = (type: boolean) => {
  return type ? "text-red-600 " : "text-green-600 ";
};
