import React from "react";
import { DeleteModal, NotItem } from "../../../components";
import { Button, Pagination, Popconfirm, Spin } from "antd";

import { getInvoiceStatusColor } from "../../../utils/getMethodColor";
import { IInvoice } from "../../../interfaces";
import { InvoiceStatus } from "../../../enums";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  invoices: IInvoice[];
  isLoading: boolean;
  current: number;
  pageSize: number;
  total: number;
  onPaymentConfirm: (record: IInvoice) => Promise<void>;
  setOpenDetailInvoice: (value: boolean) => void;
  setRecord: (value: IInvoice) => void;
  onChange: (page: number, pageSize?: number) => void;
  onDeleteInvoice: (record: IInvoice) => Promise<void>;
}

const InvoiceCard: React.FC<Props> = ({
  invoices,
  isLoading,
  current,
  pageSize,
  total,
  onPaymentConfirm,
  setOpenDetailInvoice,
  setRecord,
  onChange,
  onDeleteInvoice,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  return (
    <Spin spinning={isLoading}>
      {invoices.length > 0 ? (
        <div className="m-4 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <div
                key={invoice._id}
                className={` shadow-md rounded-lg p-5 border-t-4  transform transition-transform hover:scale-105
                  ${bgColor} ${textColor}
                  `}
              >
                {/* Contract Header */}
                <div className="border-b pb-3 mb-3 justify-between flex">
                  <p className="text-2xl  font-bold">
                    <i className="fa-solid fa-bed mr-2"></i>
                    {invoice.room.roomName}
                  </p>
                  <>
                    {invoice.status === InvoiceStatus.UNPAID && (
                      <Popconfirm
                        title="Payment Confirmation"
                        description="Are you sure you want to confirm the payment?"
                        onConfirm={async () => await onPaymentConfirm(invoice)}
                        okText="Yes"
                        cancelText="No"
                        placement="leftBottom"
                      >
                        <Button
                          icon={
                            <i className="fa-solid fa-check text-green-500 "></i>
                          }
                        >
                          <p className="text-green-500 font-bold">Confirm</p>
                        </Button>
                      </Popconfirm>
                    )}
                  </>
                </div>

                {/* Contract Body */}
                <div className="space-y-2">
                  <p className="font-semibold">
                    <i className="fa-solid fa-user mr-2"></i>
                    {invoice.tenant.name}
                  </p>
                  <p className="font-semibold">
                    <i className="fa-solid fa-cubes mr-2"></i>
                    {invoice.service.name}
                  </p>

                  <p className="font-semibold">
                    <i className="fa-solid fa-calendar-days mr-2"></i>
                    {invoice.month}
                  </p>
                  <p className="font-bold mt-6">
                    <span
                      className={`${getInvoiceStatusColor(invoice.status)} `}
                    >
                      <i
                        className={`fa-solid ${
                          invoice.status === InvoiceStatus.PAID
                            ? `fa-check-circle`
                            : `fa-times-circle`
                        } mr-2`}
                      ></i>

                      {invoice.status}
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="font-semibold text-orange-500">
                      <i className="fa-solid fa-hand-holding-dollar mr-2"></i>
                      {invoice.amount.toLocaleString()} đ
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className=" transition"
                      onClick={() => {
                        setOpenDetailInvoice(true);
                        setRecord(invoice);
                      }}
                      icon={
                        <i
                          className="fa-solid fa-eye text-xl
                        text-blue-600
                        "
                        />
                      }
                    >
                      Detail
                    </Button>
                    <DeleteModal onConfirm={onDeleteInvoice} record={invoice} />
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default InvoiceCard;
