import React from "react";
import { Select } from "antd";
import { InvoiceStatus } from "../../../enums";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  status: InvoiceStatus | "";
  setStatus: (value: InvoiceStatus | "") => void;
}

const { Option } = Select;

const StatusInvoice: React.FC<Props> = ({ status, setStatus }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";

  return (
    <div className="  py-4 m-2 rounded-lg   ">
      <Select
        value={status}
        onChange={(value) => setStatus(value as InvoiceStatus | "")}
        className={`w-[100px] ${bgColor} ${textColor}`}
      >
        <Option value="" className="font-bold">
          All
        </Option>
        <Option
          value={InvoiceStatus.PAID}
          className={`font-bold ${
            status === InvoiceStatus.PAID ? "text-green-600" : ""
          }`}
        >
          {InvoiceStatus.PAID}
        </Option>
        <Option
          value={InvoiceStatus.UNPAID}
          className={`font-bold ${
            status === InvoiceStatus.UNPAID ? "text-red-600" : ""
          }`}
        >
          {InvoiceStatus.UNPAID}
        </Option>
      </Select>
    </div>
  );
};

export default StatusInvoice;
