import React from "react";
import { DeleteModal, NotItem } from "../../../components";
import {
  getRoomStatusColor,
  getRoomTypeColor,
} from "../../../utils/getMethodColor";
import { Button, Pagination, Spin } from "antd";
import { IRoom } from "../../../interfaces";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  rooms: IRoom[];
  isLoading: boolean;
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  onDeleteRoom: (record: IRoom) => Promise<void>;
  setOpenEditRoom: (open: boolean) => void;
  setOpenDetailRoom: (open: boolean) => void;
  setRecord: (record: IRoom) => void;
}

const RoomCard: React.FC<Props> = ({
  rooms,
  isLoading,
  current,
  pageSize,
  total,
  onChange,
  onDeleteRoom,
  setOpenEditRoom,
  setOpenDetailRoom,
  setRecord,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  return (
    <Spin spinning={isLoading}>
      {rooms.length > 0 ? (
        <div className="m-4 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className={` shadow-lg rounded-lg p-6 border-t-4 transform transition-all hover:scale-105 hover:shadow-xl
                ${bgColor} ${textColor}
                  `}
              >
                <div className="border-b pb-3 mb-3">
                  <p className="text-2xl font-bold ">
                    <i className="fa-solid fa-bed"></i> {room.roomName}
                  </p>
                </div>

                <div className=" space-y-2">
                  <p className="font-semibold">
                    <i className="fa-solid fa-cube mr-2"></i> {room.area} m²
                  </p>
                  <p
                    className={`font-semibold my-2 text-${getRoomTypeColor(
                      room.type
                    )} `}
                  >
                    <i className="fa-solid fa-people-roof mr-2"></i>
                    {room.type}
                  </p>

                  <p className="font-bold mt-6">
                    <span className={`${getRoomStatusColor(room.status)}`}>
                      <i className="fa-solid fa-circle mr-2"></i>
                      {room.status}
                    </span>
                  </p>
                  <p className="font-semibold  text-orange-400">
                    <i className="fa-solid fa-hand-holding-dollar mr-2"></i>
                    {room.price.toLocaleString()} đ
                  </p>
                </div>
                <div className="mt-10 flex items-center justify-between">
                  <div></div>
                  <div className="flex gap-3">
                    <Button
                      className=" transition duration-300"
                      onClick={() => {
                        setOpenDetailRoom(true);
                        setRecord(room);
                      }}
                      icon={
                        <i className="fa-solid fa-eye text-xl text-blue-500" />
                      }
                    >
                      Detail
                    </Button>
                    <Button
                      className="transition duration-300"
                      icon={
                        <i className="fa-solid fa-pen-to-square text-xl text-green-500" />
                      }
                      onClick={() => {
                        setOpenEditRoom(true);
                        setRecord(room);
                      }}
                    >
                      Edit
                    </Button>
                    <DeleteModal onConfirm={onDeleteRoom} record={room} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={onChange}
              showSizeChanger
              pageSizeOptions={["4", "8", "16", "32", "64", "128", "999999"]}
            />
          </div>
        </div>
      ) : (
        <NotItem />
      )}
    </Spin>
  );
};

export default RoomCard;
