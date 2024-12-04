import React from "react";
import { Descriptions, Drawer } from "antd";
import moment from "moment";
import { getInvoiceStatusColor } from "../../../utils/getMethodColor";
import { IInvoice } from "../../../interfaces";
import { useTheme } from "../../../contexts/ThemeContext";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  record: IInvoice;
}
const DetailInvoice: React.FC<Props> = ({ open, setOpen, record }) => {
  const formatDate = (date: Date) => {
    return moment(date).format("DD/MM/YYYY");
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
  const items = [
    renderItem("Tenant", record?.tenant?.name),
    renderItem("Phone", record?.tenant?.phone),
    renderItem("IdCard", record?.tenant?.idCard),
    renderItem("Room", record?.room.roomName),
    renderItem("First Index", record?.firstIndex),
    renderItem("Last Index", record?.finalIndex),
    renderItem("Total Number", record?.totalNumber),
    renderItem("Price", record?.service.priceUnit.toLocaleString() + " đ"),
    renderItem("Amount", record?.amount.toLocaleString() + " đ"),
    renderItem("Month", record?.month),
    renderItem(
      "Status",
      <p
        className={` ${getInvoiceStatusColor(
          record?.status
        )} text-xl font-bold p-2`}
      >
        {record?.status}
      </p>
    ),
    renderItem("Description", record?.description),
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
    <Drawer
      bodyStyle={{ padding: 0, margin: 0 }} // Xóa khoảng trắng mặc định
      onClose={() => setOpen(false)}
      open={open}
      width={"100vh"}
      closable={false}
      className={`
      ${textColor} ${bgColor}`}
    >
      <div
        className={` ${textColor} ${bgColor}
             flex-1 items-center justify-center p-2
          `}
      >
        <h1 className="text-4xl my-2 mb-6 font-bold">Invoice Detail</h1>
        <Descriptions
          //title="Invoice Detail"
          bordered
          column={1}
          items={items}
        />
      </div>
    </Drawer>
  );
};

export default DetailInvoice;
