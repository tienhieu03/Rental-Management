import { useEffect, useState } from "react";

import { message } from "antd";
import ModalDetailInvoice from "../InvoiceUserPage/ModalDetailInvoice";

import { useAppSelector } from "../../../redux/hook";
import { IContract, IInvoice, IRoom } from "../../../interfaces";
import { contractApi, invoiceApi } from "../../../api";

export default function PaymentHistoryUserPage() {
  const iduser = useAppSelector((state) => state.auth.user._id);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);

  //Lưu trữ danh sách các hóa đơn đã được lọc theo danh mục
  const [filteredInvoices, setFilteredInvoices] = useState<IInvoice[]>([]);
  

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Quản lý hợp đồng và phòng
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  useEffect(() => {
    const getContracts = async () => {
      const res = await contractApi.fetchContractApi(`tenant._id=${iduser}`);
      if (res.data) {
        const allContracts = res.data.result;
        // Lọc chỉ lấy hợp đồng có status "active"
        const activeContracts = allContracts.filter(
          (contract: IContract) => contract.status === "ACTIVE"
        );
        const roomsFromContracts = activeContracts.map(
          (contract: IContract) => contract.room
        );
        setRooms(roomsFromContracts);
        // Đặt phòng đầu tiên làm mặc định
        if (roomsFromContracts.length > 0) {
          setSelectedRoomId(roomsFromContracts[0]._id);
        }
      } else {
        message.error(res.message);
      }
    };
    getContracts();
  }, [iduser]);

  useEffect(() => {
    const getInvoices = async () => {
      const response = await invoiceApi.fetchInvoiceByUserId();
      if (response.data) {
        // Lọc các hóa đơn có trạng thái PAID
        const paidInvoices = response.data.filter(
          (invoice: IInvoice) => invoice.status === "PAID"
        );
        setInvoices(paidInvoices);
        setFilteredInvoices(paidInvoices); // Hiển thị tất cả hóa đơn PAID mặc định
      } else {
        message.error(response.message);
      }
    };
    getInvoices();
  }, []);

  useEffect(() => {
    // Lọc hóa đơn dựa trên danh mục đã chọn
    const filterByCategory = () => {
      let filtered = invoices;

      // Lọc theo phòng
      if (selectedRoomId) {
        filtered = filtered.filter(
          (invoice) => invoice.room._id === selectedRoomId
        );
      }
    

      setFilteredInvoices(filtered);
    };

    filterByCategory();
  }, [invoices, selectedRoomId]);

  const totalAmount = filteredInvoices.reduce(
    (total, invoice) => total + invoice.amount,
    0
  );

  const openModal = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
  };
  return (
    <div className="bg-[#e0f5e4] text-[#2b6534] h-full flex flex-col overflow-x-scroll sm:overflow-x-hidden">
      
      <div className="p-6 m-0 sm:m-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

        {/* Danh sách các phòng */}
        {rooms.length > 0 && (
          <div className="flex flex-row gap-4 mb-4">
            {rooms.map((room, index) => (
              <button
                key={room._id}
                className={`px-4 py-2 rounded-lg shadow ${
                  selectedRoomId === room._id
                    ? "bg-green-300 text-[#2b6534] cursor-pointer font-semibold"
                    : "bg-green-100 hover:bg-green-200"
                }`}
                onClick={() => setSelectedRoomId(room._id)}
              >
                Phòng {room.roomName}
              </button>
            ))}
          </div>
        )}
      

        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b p-3 text-lg">Invoice Description</th>
              <th className="border-b p-3 text-lg">Payment Date</th>
              <th className="border-b p-3 text-lg">Amount (VND)</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice._id}
                onClick={() => openModal(invoice)}
                className="cursor-pointer"
              >
                <td className="border-b p-3 text-lg">{invoice.description}</td>
                <td className="border-b p-3 text-lg">
                  {new Date(invoice.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="border-b p-3 text-lg">
                  {invoice.amount.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="text-red-600">
              <td colSpan={2} className="p-3 font-semibold text-right border-t">
                Total Amount Paid:
              </td>
              <td className="p-3 font-semibold border-t ">
                {totalAmount.toLocaleString("vi-VN")} VND
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <ModalDetailInvoice
        visible={isModalVisible}
        onClose={closeModal}
        invoice={selectedInvoice}
      />
    </div>
  );
}
