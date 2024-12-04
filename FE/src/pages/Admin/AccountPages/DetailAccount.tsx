import React from "react";
import { Descriptions, Drawer, Image, Tag } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import moment from "moment"; // Import moment for date formatting

import { getGenderColor, getRoleColor } from "../../../utils/getMethodColor";
import { IAccount } from "../../../interfaces";
import { useTheme } from "../../../contexts/ThemeContext";
interface Props {
  openDetailAccount: boolean;
  setOpenDetailAccount: (value: boolean) => void;
  record: IAccount;
}

const DetailAccount: React.FC<Props> = ({
  openDetailAccount,
  setOpenDetailAccount,
  record,
}) => {
  const formatDate = (date: string | Date) => {
    return moment(date).format("DD/MM/YYYY"); // Format date using moment
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
    renderItem("Name", record?.name),
    renderItem("Email", record?.email),
    renderItem("Gender", record?.gender),
    renderItem(
      "Birthday",
      record?.birthday ? formatDate(record?.birthday) : "N/A"
    ),
    renderItem(
      "Role",
      <p className={` ${getRoleColor(record?.role?.name)}  font-bold`}>
        {record?.role?.name}
      </p>
    ),

    renderItem("Address", record?.address),
    renderItem("ID Card", record?.idCard),
    renderItem("Phone", record?.phone),
    renderItem(
      "Active",
      <p
        className={` ${
          record?.isActive ? "text-green-300" : "text-red-300"
        }   font-bold`}
      >
        {record?.isActive ? "ACTIVE" : "INACTIVE"}
      </p>
    ),

    renderItem(
      "Front ID Card",
      record?.imagesIdCard[0] ? (
        <Image width={100} height={70} src={`${record?.imagesIdCard[0]}`} />
      ) : (
        <i className="fa-solid fa-id-card text-4xl text-gray-400"></i>
      )
    ),
    renderItem(
      "Back ID Card",
      record?.imagesIdCard[1] ? (
        <Image width={100} height={70} src={`${record?.imagesIdCard[1]}`} />
      ) : (
        <i className="fa-solid fa-id-card text-4xl text-gray-400"></i>
      )
    ),
    renderItem(
      "Temporary Residence",
      record?.imagesIdCard[2] ? (
        <Image width={100} height={70} src={`${record?.imagesIdCard[2]}`} />
      ) : (
        <i className="fa-solid fa-file-contract text-4xl text-gray-400"></i>
      )
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
    <div
      className={`flex-1 
      ${textColor} ${bgColor}`}
    >
      <Drawer
        bodyStyle={{ padding: 0 }} // Xóa khoảng trắng mặc định
        onClose={() => setOpenDetailAccount(false)}
        closable={false}
        open={openDetailAccount}
        width={"100vh"}
        className={`
         ${textColor} ${bgColor}`}
      >
        <div
          className={` ${textColor} ${bgColor}
             flex-1 items-center justify-center p-2
          `}
        >
          <h1 className="text-4xl my-2 mb-6 font-bold">Account Detail</h1>
          {record?.avatar ? (
            <Image width={200} height={200} src={`${record.avatar}`} />
          ) : (
            <i className="fa-solid fa-user text-[120px] text-gray-500"></i>
          )}

          <Descriptions bordered items={items} column={1} />
        </div>
      </Drawer>
    </div>
  );
};

export default DetailAccount;
