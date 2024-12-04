import React from "react";
import { Descriptions, Drawer, Button, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import moment from "moment";
import { getContractStatusColor } from "../../../utils/getMethodColor";
import { downloadContractPDF } from "../../../utils/generateContractPDF";
import { IContract } from "../../../interfaces";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  openDetailContract: boolean;
  setOpenDetailContract: (value: boolean) => void;
  record: IContract;
}

const { Text } = Typography;

const DetailContract: React.FC<Props> = ({
  openDetailContract,
  setOpenDetailContract,
  record,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";

  const formatDate = (date: Date) => moment(date).format("DD/MM/YYYY");

  const handlePrintPDF = () => {
    if (record) downloadContractPDF(record);
  };

  const renderItem = (label: string, value: React.ReactNode) => ({
    key: label,
    label: <span className={textColor}>{label}</span>,
    children: <span className={textColor}>{value}</span>,
  });

  const items = [
    renderItem("Tenant", record?.tenant.name),
    renderItem("Phone", record?.tenant.phone),
    renderItem("IdCard", record?.tenant.idCard),
    renderItem("Email", record?.tenant.email),
    renderItem("Address", record?.tenant.address),
    renderItem("Room", record?.room.roomName),
    renderItem("Price", `${record?.room.price.toLocaleString()} đ`),
    renderItem("Innkeeper", record?.innkeeper.name),
    renderItem("Start Date", formatDate(record?.startDate)),
    renderItem("End Date", formatDate(record?.endDate)),
    renderItem("Rent Cycle Count", record?.rentCycleCount),
    renderItem("Deposit Amount", `${record?.depositAmount.toLocaleString()} đ`),
    renderItem(
      "Status",
      <Text className={getContractStatusColor(record?.status)} strong>
        {record?.status}
      </Text>
    ),
    renderItem(
      "Actual End Date",
      record?.actualEndDate ? formatDate(record?.actualEndDate) : "N/A"
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

  return (
    <div className={`flex-1 ${textColor} ${bgColor}`}>
      <Drawer
        bodyStyle={{ padding: 0, margin: 0 }} // Xóa khoảng trắng mặc định
        onClose={() => setOpenDetailContract(false)}
        open={openDetailContract}
        width="100vh"
        closable={false}
        className={`${textColor} ${bgColor}`}
      >
        <div
          className={`flex items-center justify-between p-2 ${textColor} ${bgColor}`}
        >
          <h1 className="text-4xl font-bold">Contract Detail</h1>
          <Button
            type="primary"
            size="large"
            className="bg-orange-600 hover:bg-orange-700 transition duration-200"
            icon={<PrinterOutlined />}
            onClick={handlePrintPDF}
          >
            Print Contract
          </Button>
        </div>
        <div className={`p-2 ${textColor} ${bgColor}`}>
          <Descriptions bordered column={1} items={items} />
        </div>
      </Drawer>
    </div>
  );
};

export default DetailContract;
