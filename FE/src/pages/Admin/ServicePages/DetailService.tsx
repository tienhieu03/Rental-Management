import React from "react";
import { Descriptions, Drawer, Tag } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import moment from "moment"; // Import moment for date formatting
import { getServiceTypeColor } from "../../../utils/getMethodColor";
import { useTheme } from "../../../contexts/ThemeContext";
interface Props {
  openDetailService: boolean;
  setOpenDetailService: (value: boolean) => void;
  record: any;
}
const DetailService: React.FC<Props> = ({
  openDetailService,
  setOpenDetailService,
  record,
}) => {
  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY"); // Format date using moment
  };
  const { theme } = useTheme();

  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const renderItem = (label: string, value: React.ReactNode) => ({
    key: label,
    label: <span className={textColor}>{label}</span>,
    children: <span className={textColor}>{value}</span>,
  });
  const item = [
    renderItem("ServiceName", record?.serviceName),
    renderItem(
      "Type",
      <p className={`${getServiceTypeColor(record?.type)} font-bold`}>
        {record?.type}
      </p>
    ),
    renderItem("Price", <>{record?.price.toLocaleString("vi-VN")} đ</>),
    renderItem("Unit", record?.unit),
    renderItem("Description", record?.description),
    renderItem(
      "Created At",
      record?.createdAt ? formatDate(record?.createdAt) : "N/A"
    ),
    renderItem(
      "Created By",
      record?.createdBy ? (
        record?.createdBy?.email
      ) : (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Updating
        </Tag>
      )
    ),
    renderItem(
      "Updated At",
      record?.updatedAt ? formatDate(record?.updatedAt) : "N/A"
    ),
    renderItem(
      "Updated By",
      record?.updatedBy ? (
        record?.updatedBy?.email
      ) : (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Updating
        </Tag>
      )
    ),
  ];

  return (
    <div
      className={`flex-1 
  ${textColor} ${bgColor}`}
    >
      <Drawer
        bodyStyle={{ padding: 0, margin: 0 }} // Xóa khoảng trắng mặc định
        closable={false}
        className={`
        ${textColor} ${bgColor}`}
        onClose={() => setOpenDetailService(false)}
        open={openDetailService}
        width={"100vh"}
      >
        <div
          className={` ${textColor} ${bgColor}
             flex-1 items-center justify-center p-2
          `}
        >
          <h1 className="text-4xl my-2 mb-6 font-bold">Service Detail</h1>
          <Descriptions bordered items={item} column={1} />
        </div>
      </Drawer>
    </div>
  );
};
export default DetailService;
