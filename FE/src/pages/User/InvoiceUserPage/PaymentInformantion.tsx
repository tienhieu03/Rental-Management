import React, { useEffect, useState, useMemo } from "react";
import { message, Pagination } from "antd";
import ModalDetailInvoice from "./ModalDetailInvoice";
import { IInvoice } from "../../../interfaces";
import { invoiceApi } from "../../../api";
import { useAppSelector } from "../../../redux/hook";

interface PaymentInformationProps {
  setIdInvoices: (ids: string[]) => void;
  idInvoice: string[];
}

export default function PaymentInformantion({
  setIdInvoices,
  idInvoice,
}: PaymentInformationProps) {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const idUser = useAppSelector((state) => state.auth.user._id);
  const [totalPage, setTotalPage] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const handlePaginationChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    if (pageSize) setPageSize(pageSize);
  };
  // Fetch hóa đơn khi component mount
  useEffect(() => {
    const getInvoices = async () => {
      const response = await invoiceApi.fetchInvoiceApi(
        `tenant._id=${idUser}&status=UNPAID`
      );
      if (response.data) {
        setInvoices(response.data.result);
        setTotalPage(response.data.meta.totalDocument);
      } else {
        message.error(response.message || "Data format is incorrect");
      }
    };
    getInvoices();
  }, [idInvoice]);

  // Tính tổng số tiền từ các id được chọn
  const total = useMemo(() => {
    return idInvoice.reduce((sum, id) => {
      const invoice = invoices.find((inv) => inv._id === id);
      return invoice ? sum + invoice.amount : sum;
    }, 0);
  }, [idInvoice, invoices]);
  console.log(total);
  // Xử lý khi checkbox được chọn/bỏ chọn
  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (e.target.checked) {
      setIdInvoices([...idInvoice, id]);
    } else {
      setIdInvoices(idInvoice.filter((item) => item !== id));
    }
  };

  const openModal = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="bg-white mb-5 mx-5 rounded-2xl p-6 shadow-lg text-[#2b6534] flex-grow overflow-y-auto h-[362px] custom-scrollbar">
      <h3 className="text-xl font-semibold text-[#2b6534] mb-2">
        Payment Information
      </h3>
      <table className="w-full border text-left border-collapse">
        <thead>
          <tr className="border">
            <th className="py-2 px-4 border-r">No.</th>
            <th className="py-2 px-4 border-r">ID</th>
            <th className="py-2 px-4 border-r">Room</th>
            <th className="py-2 px-4 border-r">Description</th>
            <th className="py-2 px-4 border-r">Amount</th>
            <th className="py-2 px-4 border-r">Note</th>
            <th className="py-2 px-4 border-r">Status</th>
            <th className="py-2 px-4">Select</th>
          </tr>
        </thead>
        <tbody>
          {invoices?.map((invoice, index) => (
            <tr key={invoice._id}>
              <td className="py-2 px-4 border">{index + 1}</td>
              <td
                className="py-2 px-4 border cursor-pointer"
                onClick={() => openModal(invoice)}
              >
                {invoice._id}
              </td>
              <td className="py-2 px-4 border">{invoice.room.roomName}</td>
              <td className="py-2 px-4 border">{invoice.service.name}</td>
              <td className="py-2 px-4 border">
                {invoice.amount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
              </td>
              <td className="py-2 px-4 border">{invoice.description}</td>
              <td className="py-2 px-4 border">{invoice.status}</td>
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={idInvoice.includes(invoice._id)}
                  onChange={(e) => handleCheckbox(e, invoice._id)}
                  className="form-checkbox h-5 w-5"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 flex justify-end">
        <Pagination
          current={current}
          pageSize={pageSize}
          total={totalPage}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={["4", "8", "16", "32", "64", "128", "999999"]}
        />
      </div>
      <div className="text-red-600 text-right mt-4 font-semibold">
        Total Selected Amount:
        <span className="p-3 font-semibold border-t">
          {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
        </span>
      </div>
      <ModalDetailInvoice
        visible={isModalVisible}
        onClose={closeModal}
        invoice={selectedInvoice}
      />
    </div>
  );
}
