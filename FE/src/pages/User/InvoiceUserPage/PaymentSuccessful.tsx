
import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/user/dashboardUser"); // Điều hướng về trang dashboard
    };

    const goToInvoices = () => {
        navigate("/user/invoiceUser"); // Điều hướng về trang thanh toán
    };

    return (
        <div className="bg-[#e0f5e4] text-[#2b6534] h-screen flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-6 m-14 bg-white rounded-lg shadow-md h-full flex items-center justify-center">
                <Result
                    status="success"
                    title="Payment successful!"
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

export default PaymentSuccess;

