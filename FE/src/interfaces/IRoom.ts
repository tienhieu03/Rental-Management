import { RoomStatus, RoomType } from "../enums";
interface IRoom {
  _id: string;
  roomName: string;
  area: number;
  type: RoomType;
  status: RoomStatus;
  price: number;
  description: string;
  services: any[];
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
export default IRoom;


