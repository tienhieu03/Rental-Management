import React, { useEffect, useState } from "react";
import {
  Collapse,
  Descriptions,
  Drawer,
  message,
  notification,
  Switch,
  Tag,
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import moment from "moment"; // Import moment for date formatting
import {
  getRoomStatusColor,
  getRoomTypeColor,
} from "../../../utils/getMethodColor";
import { IService } from "../../../interfaces";
import { serviceApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";
interface Props {
  openDetailRoom: boolean;
  setOpenDetailRoom: (value: boolean) => void;
  record: any;
}
const DetailRoom: React.FC<Props> = ({
  openDetailRoom,
  setOpenDetailRoom,
  record,
}) => {
  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY"); // Format date using moment
  };
  const { theme } = useTheme();

  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enableService, setEnableService] = useState<string[]>([]);
  useEffect(() => {
    const getService = async () => {
      setIsLoading(true);

      setEnableService(record?.services);

      const response = await serviceApi.fetchServiceApi(
        "pageSize=1000&currentPage=1"
      );
      if (response.data) {
        setServices(response.data.result);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
      setIsLoading(false);
    };
    getService();
  }, [record]);
  const renderItem = (label: string, value: React.ReactNode) => ({
    key: label,
    label: <span className={textColor}>{label}</span>,
    children: <span className={textColor}>{value}</span>,
  });
  const item = [
    renderItem("Room Name", record?.roomName),
    renderItem(
      "Type",
      <p className={`${getRoomTypeColor(record?.type) as string} font-bold`}>
        {record?.type}
      </p>
    ),
    renderItem("Area", `${record?.area} m2`),
    renderItem("Price", `${record?.price.toLocaleString("vi-VN")} đ`),
    renderItem("Description", record?.description),
    renderItem(
      "Status",
      <p
        className={`${getRoomStatusColor(record?.status) as string} font-bold`}
      >
        {record?.status}
      </p>
    ),
    renderItem(
      "Created At",
      <span className={textColor}>{formatDate(record?.createdAt)}</span>
    ),
    renderItem(
      "Created By",
      <span className={textColor}>{record?.createdBy?.email}</span>
    ),
    renderItem(
      "Updated At",
      <span className={textColor}>{formatDate(record?.updatedAt)}</span>
    ),
    renderItem(
      "Updated By",
      <span className={textColor}>{record?.updatedBy?.email}</span>
    ),
  ];
  const handleSwitchChange = (checked: boolean, id: string) => {
    setEnableService((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };
  return (
    <div
      className={`flex-1 
  ${textColor} ${bgColor}`}
    >
      <Drawer
        bodyStyle={{ padding: 0, margin: 0 }} // Xóa khoảng trắng mặc định
        closable={false}
        loading={isLoading}
        onClose={() => setOpenDetailRoom(false)}
        open={openDetailRoom}
        width={"100vh"}
      >
        <div
          className={` ${textColor} ${bgColor}
             flex-1 items-center justify-center p-2
          `}
        >
          <h1 className="text-4xl my-2 mb-6 font-bold">Room Detail</h1>
          <Descriptions bordered items={item} column={1} />
          <div className="my-2" />
          <Collapse>
            <Collapse.Panel
              header={
                <div className="flex items-center justify-between">
                  <span className={`${textColor}`}>Services</span>
                  <Switch
                    disabled
                    checked={enableService?.length === services?.length}
                  />
                </div>
              }
              key="1"
            >
              {services.map((service) => (
                <div
                  key={service._id}
                  className={`flex items-center p-2 border border-gray-200 rounded-md 
               ${textColor} ${bgColor}
                 `}
                >
                  <p>{service.serviceName}</p>
                  <Switch
                    disabled
                    checked={enableService?.includes(service._id)}
                    onChange={(checked) =>
                      handleSwitchChange(checked, service._id)
                    }
                    className="ml-auto"
                  />
                </div>
              ))}
            </Collapse.Panel>
          </Collapse>
        </div>
      </Drawer>
    </div>
  );
};
export default DetailRoom;
