import { useEffect, useState } from "react";

import { useAppSelector } from "../../../redux/hook";


import { notification } from "antd";
import { IAccount } from "../../../interfaces";
import { accountApi } from "../../../api";
export default function ProfilePage() {
    const [accounts, setAccount] = useState<IAccount>();

    const iduser = useAppSelector((state) => state.auth.user._id); // Sửa tên biến id nếu cần thiết

    useEffect(() => {
        const getAccount = async () => {


            const response = await accountApi.fetchAccountByIdApi(iduser);


            if (response.data) {
                setAccount(response.data);
            } else {

                notification.error({
                    message: "Error",
                    description: response.message,
                });
             

            }
        };
        getAccount();
    }, [iduser]);

    return (
        <div className="text-[#2b6534] z-10">
            <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-1">
                Profile Information
            </h2>
            <div className="space-y-4">
        
                <div className="flex flex-col">
                    <span className="text-lg py-3">
                        Full name: {accounts?.name}
                    </span>
                    <span className="text-lg py-3">Email: {accounts?.email}</span>
                    <span className="text-lg py-3">
                        Address: {accounts?.address}
                    </span>
                    <span className="text-lg py-3">
                        Id card: {accounts?.idCard}
                    </span>
                    <span className="text-lg py-3">Phone: {accounts?.phone}</span>
                    <span className="text-lg py-3">
                        Birthday:

                        {new Date(accounts?.birthday ?? "").toLocaleDateString(

                            "en-GB"
                        )}
                    </span>
                    <span className="text-lg py-3">
                        Gender: {accounts?.gender}
                    </span>
                    {/* <span className="text-lg py-3">
                        Password: {accounts?.password}
                    </span> */}
                </div>
            </div>
        </div>
    );
}