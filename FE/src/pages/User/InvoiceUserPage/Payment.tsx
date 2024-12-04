import React, { useState, useEffect } from "react";

import { payOSApi } from "../../../api/";

export const PaymentButton = ({
    onCreatePaymentLink,
}: {
    onCreatePaymentLink: any;
}) => (
    <div className="main-box">
        <div className="checkout">
            <button
                type="button"
                id="create-payment-link-btn"
                onClick={onCreatePaymentLink}
                className="underline text-red-300"
            >
                Đến trang thanh toán
            </button>
        </div>
    </div>
);

const CheckoutMessage = ({ message }: { message: string }) => (
    <div className="main-box">
        <div className="checkout">
            <div className="product">
                <p>{message}</p>
            </div>
            <button
                type="button"
                id="create-payment-link-btn"
                onClick={() => (window.location.href = "/")}
            >
                Quay lại trang thanh toán
            </button>
        </div>
    </div>
);

export default function Payment({
    idInvoice,
    res,
}: {
    idInvoice: string[];
    res: any;
}) {
    const [message, setMessage] = useState("");

    //   const handleAutoUpdateStatus = async () => {
    //     try {
    //       const response = await updateStatusInvoice(idInvoice);
    //       console.log("Status updated:", response);
    //     } catch (error) {
    //       console.error("Error updating status:", error);
    //     }
    //   };

    const handleCreatePaymentLink = async () => {
        try {
            const response = await payOSApi.createLinkPayment(idInvoice);
            console.log(response);
            if (response.data && response.data.checkoutUrl) {
                window.location.href = response.data.checkoutUrl;
            } else {
                setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error creating payment link:", error);
            setMessage("Không thể tạo link thanh toán. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        // Kiểm tra trạng thái đơn hàng
        const query = new URLSearchParams(window.location.search);
        console.log(query);
        if (query.get("success")) {
            setMessage("Thanh toán thành công. Cảm ơn bạn đã sử dụng payOS!");
            //  handleAutoUpdateStatus(); // Gọi cập nhật trạng thái khi thanh toán thành công
        }

        if (query.get("canceled")) {
            setMessage(
                "Thanh toán thất bại. Nếu có bất kỳ câu hỏi nào hãy gửi email tới support@payos.vn."
            );
        }
    }, []);

    return message ? (
        <CheckoutMessage message={message} />
    ) : (
        <PaymentButton onCreatePaymentLink={handleCreatePaymentLink} />
    );
}
