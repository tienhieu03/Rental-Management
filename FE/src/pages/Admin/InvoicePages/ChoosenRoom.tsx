import React, { useState, useEffect } from "react";
import { Dropdown, Menu, notification, Button, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { IRoom } from "../../../interfaces";
import { roomApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  choosenRoom: string;
  setChooenRoom: (value: string) => void;
}

const ChoosenRoom: React.FC<Props> = ({ choosenRoom, setChooenRoom }) => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9999);

  const getRoom = async () => {
    const res = await roomApi.fetchRoomApi(
      `currentPage=${currentPage}&pageSize=${pageSize}&sort=roomName`
    );
    if (res.data) {
      setRooms(res.data.result);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";

  // Tạo menu cho Dropdown
  const menu = (
    <Menu>
      {/* Tùy chọn "All" */}
      <Menu.Item
        key="all"
        onClick={() => setChooenRoom("")}
        style={{
          fontWeight: choosenRoom === "" ? "bold" : "normal",
          color: choosenRoom === "" ? "#1890ff" : "inherit",
        }}
      >
        All
      </Menu.Item>
      {/* Các phòng */}
      <Menu.Divider />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "8px",
          padding: "8px",
        }}
      >
        {rooms.map((room) => (
          <Menu.Item
            key={room._id}
            onClick={() => setChooenRoom(room._id)}
            style={{
              fontWeight: choosenRoom === room._id ? "bold" : "normal",
              color: choosenRoom === room._id ? "#1890ff" : "inherit",
              textAlign: "center",
              border:
                choosenRoom === room._id
                  ? "1px solid #1890ff"
                  : "1px solid #d9d9d9",
              borderRadius: "4px",
              padding: "4px",
            }}
          >
            {room.roomName}
          </Menu.Item>
        ))}
      </div>
    </Menu>
  );

  return (
    <div className="  py-4 my-2 rounded-lg   ">
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button>
          {choosenRoom
            ? rooms.find((room) => room._id === choosenRoom)?.roomName ||
              "Unknown"
            : "Select a Room"}

          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default ChoosenRoom;
