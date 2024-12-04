import React from "react";
import { Button, Popconfirm, Pagination, Spin } from "antd";
import { getContractStatusColor } from "../../../utils/getMethodColor";
import { DeleteModal, NotItem } from "../../../components";
import { IContract } from "../../../interfaces";
import { ContractStatus } from "../../../enums";
import { useTheme } from "../../../contexts/ThemeContext";
interface Props {
  contracts: IContract[];
  isLoading: boolean;
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  setOpenDetailContract: (value: boolean) => void;
  setRecord: (value: IContract) => void;
  handleCancelContract: (id: string, roomId: string) => void;
  onDelete: (record: IContract) => Promise<void>;
}

const ContractCards: React.FC<Props> = ({
  contracts,
  isLoading,
  current,
  pageSize,
  total,
  onChange,
  setOpenDetailContract,
  setRecord,
  handleCancelContract,
  onDelete,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  return (
    <Spin spinning={isLoading}>
      {contracts.length > 0 ? (
        <div className="m-4 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <div
                key={contract._id}
                className={` shadow-md rounded-lg p-5 border-t-4 transform transition-transform hover:scale-105
                  ${bgColor} ${textColor}
                  `}
              >
                {/* Contract Header */}
                <div className="border-b pb-3 mb-3 flex justify-between">
                  <p className="text-2xl font-bold ">
                    <i className="fa-solid fa-bed"></i> {contract.room.roomName}
                  </p>
                  <>
                    {contract.status === ContractStatus.ACTIVE && (
                      <Popconfirm
                        title="Cancel Contract"
                        description="Are you sure you want to cancel this contract?"
                        onConfirm={() =>
                          handleCancelContract(contract._id, contract.room._id)
                        }
                        okText="Yes"
                        cancelText="No"
                        placement="topRight"
                      >
                        <Button
                          danger
                          icon={
                            <i
                              className="fa-solid fa-house-circle-xmark
                          text-red-600
                             "
                            ></i>
                          }
                          className=" transition"
                        >
                          Cancel
                        </Button>
                      </Popconfirm>
                    )}
                  </>
                </div>

                {/* Contract Body */}
                <div className=" space-y-2">
                  <p className="font-semibold">
                    <i className="fa-solid fa-user mr-2"></i>
                    {contract.tenant.name}
                  </p>
                  <p className="font-semibold text-sm">
                    <i className="fa-solid fa-envelope mr-2 "></i>
                    {contract.tenant.email}
                  </p>
                  <p className="font-semibold">
                    <i className="fa-solid fa-phone mr-2"></i>
                    {contract.tenant.phone}
                  </p>

                  <p className="font-semibold">
                    <i className="fa-solid fa-calendar-days mr-2"></i>
                    {new Date(contract.startDate).toLocaleDateString()} {" -> "}
                    {contract.actualEndDate
                      ? new Date(contract.actualEndDate).toLocaleDateString()
                      : new Date(contract.endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Section */}
                <p className="font-bold mt-6">
                  <span className={getContractStatusColor(contract.status)}>
                    <i className="fa-solid fa-circle mr-2"></i>
                    {contract.status}
                  </span>
                </p>

                {/* Action Buttons */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold  text-orange-600">
                      <i className="fa-solid fa-hand-holding-dollar mr-2"></i>
                      {contract.depositAmount.toLocaleString()} đ
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className=" transition"
                      onClick={() => {
                        setOpenDetailContract(true);
                        setRecord(contract);
                      }}
                      icon={
                        <i
                          className="fa-solid fa-eye text-xl
                  text-blue-500
                      "
                        />
                      }
                    >
                      Detail
                    </Button>
                    {contract?.status !== ContractStatus.ACTIVE && (
                      <DeleteModal
                        onConfirm={(record) => onDelete(record)}
                        record={contract}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          <div className="mt-8 flex justify-end">
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={onChange}
              showSizeChanger
              pageSizeOptions={["4", "8", "16", "32", "64", "128", "999999"]}
            />
          </div>
        </div>
      ) : (
        <NotItem />
      )}
    </Spin>
  );
};

export default ContractCards;
