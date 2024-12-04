import React, { useEffect, useState } from "react";
import { Descriptions, Drawer } from "antd";

import { getMethodColor } from "../../../utils/getMethodColor";
import { IPermisson } from "../../../interfaces";

import { useTheme } from "../../../contexts/ThemeContext";
import dayjs from "dayjs";
import { ApiMethod } from "../../../enums";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  record: IPermisson;
}
const DetailPermission: React.FC<Props> = ({ open, setOpen, record }) => {
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
    renderItem("Name", record?.name),
    renderItem("Module", record?.module),
    renderItem(
      "Method",
      <span
        className={` text-${getMethodColor(
          record?.method as ApiMethod
        )}-600 font-bold `}
      >
        {record?.method}
      </span>
    ),
    renderItem("API Path", record?.apiPath),
    renderItem("Created At", dayjs(record?.createdAt).format("DD/MM/YYYY")),
    renderItem("Created By", record?.createdBy?.email),
    renderItem("Updated At", dayjs(record?.updatedAt).format("DD/MM/YYYY")),
    renderItem("Updated By", record?.updatedBy?.email),
  ];
  return (
    <Drawer
      bodyStyle={{ padding: 0, margin: 0 }} // Xóa khoảng trắng mặc định
      closeIcon={true}
      className={`${bgColor} ${textColor}`}
      closable={false}
      onClose={() => setOpen(false)}
      open={open}
      width={700}
    >
      <div
        className={` ${textColor} ${bgColor}
             flex-1 items-center justify-center p-2
          `}
      >
        <h1 className="text-4xl my-2 mb-6 font-bold">Permission Detail</h1>
        <Descriptions bordered column={1} className={`${bgColor} ${textColor}`}>
          {items.map((item) => (
            <Descriptions.Item key={item.key} label={item.label}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>
    </Drawer>
  );
};

export default DetailPermission;
