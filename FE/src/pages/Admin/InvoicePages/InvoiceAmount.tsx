import React, { useEffect, useState } from "react";
import { invoiceApi } from "../../../api";
import { InvoiceStatus } from "../../../enums";
import { notification } from "antd";
import { useTheme } from "../../../contexts/ThemeContext";
import CountUp from "react-countup";

interface Props {
  selectMonth: number | null;
  year: number | null;
}

const InvoiceAmount: React.FC<Props> = ({ selectMonth, year }) => {
  const [total, setTotal] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const bgC = isLightTheme ? "bg-white" : "bg-gray-800";

  // Fetch data
  useEffect(() => {
    let month = "";
    const getTotal = async () => {
      if (selectMonth === null || year === null) month = "";
      else month = `${selectMonth}-${year}`;

      const res = await invoiceApi.fetchInvoiceApi(
        `month=${month}&pageSize=99999&currentPage=1`
      );
      if (res.data) {
        setTotal(res.data.meta.totalDocument);
        const totalPaid = res.data.result.filter(
          (invoice: any) => invoice.status === InvoiceStatus.PAID
        ).length;
        const totalUnpaid = res.data.result.filter(
          (invoice: any) => invoice.status === InvoiceStatus.UNPAID
        ).length;
        setTotalPaid(totalPaid);
        setTotalUnpaid(totalUnpaid);
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    };
    getTotal();
  }, [selectMonth, year]);

  return (
    <div
      className={`flex justify-between p-4 ${bgC} shadow-lg rounded-lg gap-4 flex-1`}
    >
      {/* Tổng hóa đơn */}
      <div className="flex flex-col flex-1 justify-center items-center p-4 rounded-lg bg-blue-100 shadow-md">
        <span className="text-lg flex items-center gap-2 text-blue-600">
          <i className="fas fa-file-invoice-dollar"></i>
          Total invoices
        </span>
        <CountUp
          className="xl:text-6xl text-2xl font-bold text-blue-700"
          start={0}
          end={total}
          duration={1.5}
          separator=","
        />
      </div>

      {/* Tổng đã thanh toán */}
      <div className="flex flex-col flex-1 justify-center items-center p-4 rounded-lg bg-green-100 shadow-md">
        <span className="text-lg flex items-center gap-2 text-green-600">
          <i className="fas fa-check-circle"></i>
          Total paid
        </span>
        <CountUp
          className="xl:text-6xl text-2xl font-bold text-green-700"
          start={0}
          end={totalPaid}
          duration={1.5}
          separator=","
        />
      </div>

      {/* Tổng chưa thanh toán */}
      <div className="flex flex-col flex-1 justify-center items-center p-4 rounded-lg bg-red-100 shadow-md">
        <span className="text-lg flex items-center gap-2 text-red-600">
          <i className="fas fa-times-circle"></i>
          Total unpaid
        </span>
        <CountUp
          className="xl:text-6xl text-2xl font-bold text-red-700"
          start={0}
          end={totalUnpaid}
          duration={1.5}
          separator=","
        />
      </div>
    </div>
  );
};

export default InvoiceAmount;
