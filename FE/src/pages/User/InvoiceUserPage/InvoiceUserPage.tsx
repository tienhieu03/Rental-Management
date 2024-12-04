import { useEffect, useState } from "react";
import { SlPaperPlane } from "react-icons/sl";
import InformationPersonal from "./InformationPersonal";
import PaymentInformantion from "./PaymentInformantion";
import { IoClose } from "react-icons/io5";
import Payment from "./Payment";
import { invoiceApi, payOSApi } from "../../../api";
import { message, notification } from "antd";
import { InvoiceStatus } from "../../../enums";
import { useNavigate } from "react-router-dom";

export default function InvoiceUserPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [idInvoice, setIdInvoice] = useState<Array<string>>(
    // Retrieve invoice IDs from localStorage and ensure it's a valid array
    () => {
      const storedInvoice = localStorage.getItem("idInvoice");
      try {
        const parsedInvoices = JSON.parse(storedInvoice || "[]");
        return Array.isArray(parsedInvoices) ? parsedInvoices : [];
      } catch (e) {
        console.error("Invalid invoice data in localStorage", e);
        return [];
      }
    }
  );
  const [res, setRes] = useState<string>("");

  const navigate = useNavigate();

  // Effect to update localStorage whenever idInvoice changes
  useEffect(() => {
    if (idInvoice.length > 0) {
      console.log("Updating localStorage:", idInvoice);
      localStorage.setItem(
        "idInvoice",
        JSON.stringify(
          idInvoice.filter((item, index) => idInvoice.indexOf(item) === index) // Ensure uniqueness
        )
      );
    } else {
      localStorage.removeItem("idInvoice"); // Clear localStorage if no invoices
    }
  }, [idInvoice]);

  const closeModal = () => setShowModal(false);

  // Open modal with payment URL creation logic
  const openModal = async () => {
    if (!selectedBank) {
      setShowModal(true); // No bank selected
    } else if (idInvoice.length === 0) {
      setShowModal(true); // No invoices selected
    } else {
      // Bank and invoices are valid
      try {
        const response = await payOSApi.createLinkPayment(idInvoice);
        if (response) {
          setRes(response.data.checkoutUrl);
          setShowModal(true);
        } else {
          notification.error({
            message: "Error",
            description: "Something went wrong while creating payment link.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to create payment link.",
        });
      }
    }
  };

  // Handle URL query params to process payment response
  useEffect(() => {
    if (window.location.pathname === "/user/invoiceUser") {
      const url = new URL(window.location.href);
      const cancel = url.searchParams.get("cancel");
      const status = url.searchParams.get("status");
      const orderCode = url.searchParams.get("orderCode");

      if (cancel === "true") {
        notification.success({
          message: "Payment Cancel",
          description: "Your payment has been canceled.",
        });
        return;
      }

      if (status === InvoiceStatus.PAID && orderCode) {
        const update = async () => {
          try {
            const res = await invoiceApi.postInvoiceStatusPaymentApi(
              orderCode,
              idInvoice
            );
            if (res.status === 201) {
              message.success("Payment success");
              setIdInvoice([]); // Reset invoice IDs

              navigate("/user/invoiceUser"); // Reload the page or navigate to the same page
            }
          } catch (error) {
            console.error("Error updating invoice status:", error);
            message.error("Failed to update invoice status.");
          }
        };
        update();
      }
    }
  }, [window.location.href, idInvoice]);

  // Handle bank change selection
  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(event.target.value);
  };

  return (
    <div className="bg-[#e0f5e4] h-full flex flex-col">
      <div
        aria-label="breadcrumb"
        className="text-xl text-[#2b6534] bg-neutral-100 px-7 py-4 shadow-lg"
      >
        <ol className="flex space-x-2">
          <li>
            <a href="/tai-chinh" className="hover:underline">
              Finance
            </a>
          </li>
          <li>
            <span className="text-[#2b6534]">›</span>
          </li>
          <li className="font-semibold">Pay online</li>
        </ol>
      </div>

      <div className="bg-white mb-5 mx-5 mt-5 rounded-2xl p-6 shadow-lg text-[#2b6534]">
        {/* Personal Information */}
        <InformationPersonal />

        {/* Payment Section */}
        <div className="flex items-center justify-end space-x-4 text-lg">
          <select
            className="border-2 border-lime-600 rounded-md p-2"
            defaultValue="SelectBank"
            value={selectedBank}
            onChange={handleBankChange}
          >
            <option value="SelectBank">Chọn tài khoản ngân hàng</option>
            <option value="QRCode">QR Code</option>
          </select>
          <button
            onClick={openModal}
            className="bg-amber-300 text-[#2b6534] px-4 py-2 rounded-md flex items-center hover:bg-amber-500"
          >
            <SlPaperPlane size={24} />
            <span className="pl-2">Make Payment</span>
          </button>
        </div>
      </div>

      {/* Payment Information */}
      <PaymentInformantion setIdInvoices={setIdInvoice} idInvoice={idInvoice} />

      {/* Modal for displaying payment link or errors */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-3 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2 text-[#2b6534]">
              Thông báo
            </h3>
            {!selectedBank && (
              <p className="text-[#2b6534] text-center mb-4">
                Vui lòng chọn ngân hàng
              </p>
            )}
            {idInvoice.length === 0 && (
              <p className="text-[#2b6534] text-center mb-4">
                Vui lòng chọn khoản thanh toán
              </p>
            )}
            {selectedBank && idInvoice.length > 0 && (
              <Payment idInvoice={idInvoice} res={res} />
            )}
            <button
              onClick={closeModal}
              className="text-[#2b6534] rounded-lg mt-4 font-semibold flex items-center justify-self-end"
            >
              <IoClose /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
