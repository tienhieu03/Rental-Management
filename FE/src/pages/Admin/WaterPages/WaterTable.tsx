import React from "react";
import { Table, Input, message, notification, Button } from "antd";
import { IContract, IService } from "../../../interfaces";
import { invoiceApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  contract: IContract[];
  water: IService;
  numberIndex: {
    [key: string]: {
      firstIndex: number;
      finalIndex: number;
      invoiceId: string;
    };
  };
  loading: boolean;
  handleInputChange: (
    id: string,
    field: "firstIndex" | "finalIndex",
    value: number
  ) => void;
  selectedMonth: number;
  year: number;
}
const WaterTable: React.FC<Props> = ({
  contract,
  numberIndex,
  loading,
  handleInputChange,
  water,
  selectedMonth,
  year,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const handleOK = async (key: string) => {
    const indexData = numberIndex[key];
    if (
      !indexData.firstIndex ||
      !indexData.finalIndex ||
      indexData.firstIndex > indexData.finalIndex
    ) {
      notification.error({
        message: "First index must be less than final index",
      });

      return;
    }

    if (indexData.invoiceId) {
      const res = await invoiceApi.patchInvoiceApi(
        indexData.invoiceId,
        indexData.firstIndex,
        indexData.finalIndex
      );
      res.statusCode === 200
        ? message.success("Updated successfully")
        : notification.error({
            message: "Error",
            description: res.message,
          });
    } else {
      const contractInfo = contract.find((c) => c._id === key);
      if (!contractInfo) return;

      const res = await invoiceApi.postInvoiceApi(
        {
          _id: contractInfo.room._id,
          roomName: contractInfo.room.roomName,
        },
        {
          _id: contractInfo.tenant._id,
          name: contractInfo.tenant.name,
          idCard: contractInfo.tenant.idCard,
          phone: contractInfo.tenant.phone,
        },
        {
          _id: water._id,
          name: water.serviceName,
          unit: water.unit,
          priceUnit: parseFloat(water.price),
        },
        `${selectedMonth}-${year}`,
        `Water bill for ${selectedMonth}-${year}`,
        indexData.firstIndex,
        indexData.finalIndex
      );
      res.statusCode === 201
        ? message.success("Created successfully")
        : notification.error({
            message: "Error",
            description: res.message,
          });
    }
  };
  const columns = [
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room: any) => room.roomName,
    },
    {
      title: "Tenant",
      dataIndex: "tenant",
      key: "tenant",
      render: (tenant: any) => tenant.name,
    },
    {
      title: "First index",
      dataIndex: "firstIndex",
      key: "firstIndex",
      render: (_: any, record: IContract) => (
        <Input
          type="number"
          value={numberIndex[record._id]?.firstIndex}
          onChange={(e) =>
            handleInputChange(
              record._id,
              "firstIndex",
              parseInt(e.target.value)
            )
          }
          style={
            theme === "light"
              ? {
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #444",
                }
              : {
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444",
                }
          }
        />
      ),
    },
    {
      title: "Final Index",
      dataIndex: "finalIndex",
      key: "finalIndex",
      render: (_: any, record: IContract) => (
        <Input
          type="number"
          value={numberIndex[record._id]?.finalIndex}
          onChange={(e) =>
            handleInputChange(
              record._id,
              "finalIndex",
              parseInt(e.target.value)
            )
          }
          style={
            theme === "light"
              ? {
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #444",
                }
              : {
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444",
                }
          }
        />
      ),
    },
    {
      title: "Total Index",
      dataIndex: "totalIndex",
      key: "totalIndex",
      render: (_: any, record: IContract) => (
        <Input
          type="number"
          disabled
          value={
            (numberIndex[record._id]?.finalIndex || 0) -
            (numberIndex[record._id]?.firstIndex || 0)
          }
          style={
            theme === "light"
              ? {
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #444",
                }
              : {
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444",
                }
          }
        />
      ),
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: () => <p>{parseFloat(water.price).toLocaleString()}đ</p>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_: any, record: IContract) => {
        return (
          <p>
            {(
              parseFloat(
                `${
                  (numberIndex[record._id]?.finalIndex || 0) -
                  (numberIndex[record._id]?.firstIndex || 0)
                }`
              ) * parseFloat(water.price)
            ).toLocaleString()}
            đ
          </p>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: IContract) => (
        <Button
          onClick={() => handleOK(record._id)}
          icon={
            <i className="fa-solid fa-floppy-disk text-xl text-green-500"></i>
          }
        >
          Save
        </Button>
      ),
      with: 100,
    },
  ];
  return (
    <div
      className={` p-2 rounded-lg m-2
        ${bgColor} ${textColor} 
     `}
    >
      <Table
        className={`
      ${bgColor} ${textColor}  hover:text-black
      `}
        loading={loading}
        columns={columns}
        dataSource={contract}
        rowKey={(record) => record._id}
        rowClassName={`
      ${bgColor} ${textColor}  hover:text-black
        `} // Added class for row hover styling
        bordered
        // style={{ color: "#000" }} // Ensure text is white
      />
    </div>
  );
};

export default WaterTable;
