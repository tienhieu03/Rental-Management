import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { message, notification, Select } from "antd";
import ExportRevenueToExcel from "./ExportRevenueToExcel";
import { IInvoice } from "../../../interfaces";
import { invoiceApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function getMonthlyRevenue(
  invoices: IInvoice[]
): { month: string; totalAmount: number }[] {
  const revenueByMonth: { [key: string]: number } = {};

  invoices.forEach((invoice) => {
    const month = invoice.month;
    revenueByMonth[month] = (revenueByMonth[month] || 0) + invoice.amount;
  });

  return Object.keys(revenueByMonth)
    .map((month) => ({
      month,
      totalAmount: revenueByMonth[month],
    }))
    .sort(
      (a, b) =>
        new Date(`01-${a.month}`).getTime() -
        new Date(`01-${b.month}`).getTime()
    );
}

const MonthlyRevenueChart = () => {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const { theme } = useTheme();

  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await invoiceApi.fetchInvoiceApi(
        "pageSize=99999&currentPage=1&status=PAID"
      );
      if (res.data) {
        setInvoices(res.data.result);
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(
    (invoice) => invoice.month.split("-")[1] === selectedYear
  );

  const monthlyData = getMonthlyRevenue(filteredInvoices);

  const data = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        type: "bar" as const,
        label: "Revenue",
        data: monthlyData.map((item) => item.totalAmount),
        backgroundColor: "rgba(11, 221, 29, 0.5)",
        borderColor: "#055c29",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: theme === "dark" ? "#fff" : "#000", // Màu chữ của legend
        },
      },
      tooltip: {
        bodyColor: theme === "dark" ? "#fff" : "#000", // Màu chữ tooltip
        backgroundColor: theme === "dark" ? "#333" : "#fff", // Nền tooltip
        borderColor: theme === "dark" ? "#fff" : "#000", // Viền tooltip
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (VND)",
          color: theme === "dark" ? "#fff" : "#000", // Màu chữ trục Y
        },
        ticks: {
          color: theme === "dark" ? "#fff" : "#000", // Màu chữ số trục Y
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
          color: theme === "dark" ? "#fff" : "#000", // Màu chữ trục X
        },
        ticks: {
          color: theme === "dark" ? "#fff" : "#000", // Màu chữ số trục X
        },
      },
    },
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const years = Array.from(
    new Set(invoices.map((invoice) => invoice.month.split("-")[1]))
  ).sort();

  return (
    <div
      className={`p-6 rounded-lg shadow-md flex-1 mx-1 overflow-y-hidden ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-xl font-bold text-center mb-4">
        Monthly Revenue Chart
      </h2>

      <div className="mb-4 text-center flex flex-1 justify-end items-center">
        <div className="flex justify-end items-center">
          <Select
            size="large"
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
          >
            {years.map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
          <ExportRevenueToExcel monthlyData={monthlyData} />
        </div>
      </div>
      <Chart
        type="bar"
        data={data}
        options={options}
        width={"100vw"}
        height={40}
      />
    </div>
  );
};

export default MonthlyRevenueChart;
