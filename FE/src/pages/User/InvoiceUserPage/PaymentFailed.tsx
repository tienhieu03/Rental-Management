import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const PaymentFailed: React.FC = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/user/dashboardUser"); // Điều hướng tới trang chủ
    };

    const goToInvoices = () => {
        navigate("/user/invoiceUser"); // Điều hướng tới trang hóa đơn
    };

    return (
        <div className="bg-[#e0f5e4] text-[#2b6534] h-screen flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-6 m-14 bg-white rounded-lg shadow-md h-full flex items-center justify-center">
                <Result
                    status="error"
                    title="Payment Failed!"
                    subTitle="There was a problem during payment. Please try again."
                    extra={[
                        <Button key="home" type="primary" onClick={goToHome}>
                            Go Dashboard
                        </Button>,
                        <Button key="invoices" onClick={goToInvoices}>
                            Go Pay
                        </Button>,
                    ]}
                />
            </div>
        </div>
    );
};

export default PaymentFailed;

// <div className="flex items-center justify-center bg-gray-100 bg-opacity-60 absolute top-0 bottom-0 left-0 right-0">
//     <div className="bg-red-100 rounded-lg p-8 w-96 shadow-lg">
//         <h2 className="text-xl font-semibold text-red-600 mb-4">
//             Thanh toán thất bại!
//         </h2>

//         <p className="text-gray-700 mb-6">
//             Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.
//         </p>

//         <button
//             onClick={() => window.history.back()} // Quay lại trang trước
//             className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
//         >
//             Quay lại
//         </button>
//     </div>
// </div>
