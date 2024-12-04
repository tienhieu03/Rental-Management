import { useEffect, useState } from "react";
import {
  getRoomStatusColor,
  getRoomTypeColor,
} from "../../../utils/getMethodColor";
import { message, notification, Table } from "antd";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { roomApi } from "../../../api";
import { RoomStatus } from "../../../enums";
import { useTheme } from "../../../contexts/ThemeContext";
function AvailableRoom() {
  const [rooms, setRooms] = useState([]);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const columns = [
    // { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Room Name", dataIndex: "roomName", key: "roomName" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <p className={`text-${getRoomTypeColor(type)} font-bold`}>{type}</p>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <p>{price.toLocaleString()} đ</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <p className={`${getRoomStatusColor(status)} font-bold`}>{status}</p>
      ),
    },
  ];

  useEffect(() => {
    const getRooms = async () => {
      const res = await roomApi.fetchRoomApi(
        `currentPage=${currentPage}&pageSize=${pageSize}&status=${RoomStatus.Available}`
      );

      if (res.data) {
        setRooms(res.data.result);
        setTotal(res.data.meta.totalDocument);
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    };

    getRooms();

    setLoading(false);
  }, [currentPage, pageSize]);
  const onChange = (pagination: any) => {
    if (pagination.current !== currentPage && pagination) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize !== pageSize && pagination) {
      setPageSize(pagination.pageSize);
      setCurrentPage(1);
    }
  };
  return (
    <div
      className={` p-2 rounded-lg m-1 flex-1 shadow-lg
     ${bgColor} ${textColor}
      `}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6">List of available rooms</Typography>
        </Box>
        <Box flexGrow={1}>
          <Table
            loading={loading}
            className="flex-1 "
            columns={columns}
            dataSource={rooms}
            onChange={onChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              // showSizeChanger: true,
              // pageSizeOptions: [5, 10, 20, 50, 100, 200],
            }}
            rowClassName={`
              ${bgColor} ${textColor} hover:text-black
            `}
          />
        </Box>
      </Stack>
    </div>
  );
}

export default AvailableRoom;
