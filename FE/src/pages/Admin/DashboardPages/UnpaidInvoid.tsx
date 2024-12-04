import React, { useEffect } from "react";
import { IInvoice } from "../../../interfaces";
import { invoiceApi } from "../../../api";
import { notification, Table } from "antd";
import { title } from "process";
import { useTheme } from "../../../contexts/ThemeContext";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { getInvoiceStatusColor } from "../../../utils/getMethodColor";
function UnpaidInvoid() {
  const [unpaidInvoices, setUnpaidInvoices] = React.useState<IInvoice[]>([]);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    getUnpaidInvoices();
  }, [currentPage, pageSize]);
  const getUnpaidInvoices = async () => {
    setLoading(true);
    const res = await invoiceApi.fetchInvoiceApi(
      `currentPage=${currentPage}&pageSize=${pageSize}&status=UNPAID`
    );
    if (res.data) {
      setUnpaidInvoices(res.data.result);
      setTotal(res.data.meta.totalDocument);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
    setLoading(false);
  };
  const columns = [
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room: any) => <p>{room.roomName}</p>,
    },

    {
      title: "Tenant",
      dataIndex: "tenant",
      key: "tenant",
      render: (tenant: any) => <p>{tenant.name}</p>,
    },

    { title: "Month", dataIndex: "month", key: "month" },
    {
      title: "Total",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <p>{amount.toLocaleString()} đ</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <p className={`${getInvoiceStatusColor(status)} font-bold`}>{status}</p>
      ),
    },
  ];
  const onChange = (pagination: any) => {
    if (pagination.current !== currentPage && pagination) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize !== pageSize && pagination) {
      setPageSize(pagination.pageSize);
      setCurrentPage(1);
    }
  };
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  return (
    <div
      className={` p-2 rounded-lg m-1 flex-1 shadow-lg
 ${bgColor} ${textColor}
  `}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6">List of unpaid invoices</Typography>
        </Box>
        <Box flexGrow={1}>
          <Table
            loading={loading}
            className="flex-1 "
            columns={columns}
            dataSource={unpaidInvoices}
            onChange={onChange}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              // showSizeChanger: true,
              // pageSizeOptions: [5, 10, 20, 50, 100, 200],
            }}
            rowClassName={`
          ${bgColor} ${textColor} hover:text-black
        `}
          />
        </Box>
      </Stack>
    </div>
  );
}

export default UnpaidInvoid;
