import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";
import { roomApi } from "../../../api";
import { RoomStatus } from "../../../enums";
import { IRoom } from "../../../interfaces";
import { notification, Spin } from "antd";

function RoomStatusBar() {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "#000000" : "#FFFFFF";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [loading, setLoading] = React.useState(false);
  const [occupiedRooms, setOccupiedRooms] = React.useState<IRoom[]>([]);
  const [availableRooms, setAvailableRooms] = React.useState<IRoom[]>([]);

  useEffect(() => {
    const getStateRooms = async () => {
      setLoading(true);
      const res = await roomApi.fetchRoomApi("currentPage=1&pageSize=99999");

      if (res.data) {
        setOccupiedRooms(
          res.data.result.filter(
            (room: IRoom) => room.status === RoomStatus.Occupied
          )
        );
        setAvailableRooms(
          res.data.result.filter(
            (room: IRoom) => room.status === RoomStatus.Available
          )
        );
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
      setLoading(false);
    };
    getStateRooms();
  }, []);

  const data = [
    { name: "Occupied", value: occupiedRooms.length, color: "#f59e0b" },
    { name: "Available", value: availableRooms.length, color: "#22c55e" },
  ];

  const gradientColors = ["url(#occupiedGradient)", "url(#availableGradient)"];

  return (
    <div
      className={`p-6 rounded-xl shadow-xl ${bgColor} flex flex-col items-center m-1`}
    >
      <h3
        className={`text-xl font-bold ${
          isLightTheme ? "text-gray-800" : "text-gray-100"
        }`}
      >
        Room Status Overview
      </h3>
      {loading ? (
        <Spin size="large" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <defs>
              <linearGradient id="occupiedGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient
                id="availableGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="60%"
              paddingAngle={5}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={gradientColors[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isLightTheme ? "#ffffff" : "#333333",
                color: textColor,
                
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ color: textColor }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default RoomStatusBar;
