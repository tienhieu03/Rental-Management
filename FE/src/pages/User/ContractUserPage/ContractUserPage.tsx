import { useAppSelector } from "../../../redux/hook";
import { Alert, notification } from "antd";
import ContractExtension from "./ContractExtesion";
import { useEffect, useState } from "react";
import { IContract } from "../../../interfaces";
import { contractApi } from "../../../api";

export default function ContractUserPage() {

    const iduser = useAppSelector((state) => state.auth.user._id);
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [openContractIndex, setOpenContractIndex] = useState<number>(0); // Mặc định mở hợp đồng đầu tiên
    const [isRenewable, setIsRenewable] = useState<boolean[]>([]); // Theo dõi trạng thái nút gia hạn từng hợp đồng
    const [openAddContract, setOpenAddContract] = useState(false);
    useEffect(() => {
        const getContracts = async () => {
            const res = await contractApi.fetchContractApi(
                `tenant._id=${iduser}`
            );
            if (res.data) {
                const allContracts = res.data.result;
                // Lọc chỉ lấy hợp đồng có status "active"
                const activeContracts = allContracts.filter(
                    (contract: IContract) => contract.status === "ACTIVE"
                );
                console.log(activeContracts);
                setContracts(activeContracts);
                // Tính toán trạng thái gia hạn cho từng hợp đồng
                const renewableStates = activeContracts.map(
                    (contract: IContract) => {
                        const today = new Date();
                        const endDate = new Date(contract.endDate);
                        const diffTime = endDate.getTime() - today.getTime();
                        const diffDays = diffTime / (1000 * 60 * 60 * 24);
                        return diffDays <= 30; // Hợp đồng sắp hết hạn (trong vòng 30 ngày)
                    }
                );
                setIsRenewable(renewableStates);
                // Nếu không có hợp đồng, đặt openContractIndex về -1
                if (activeContracts.length === 0) {
                    setOpenContractIndex(-1);
                }
            }
        };
        getContracts();
    }, [iduser]);

    const toggleContract = (index: number) => {
        setOpenContractIndex(index);
    };
    const handleExtension = (contractId: string) => {
        console.log(`Gia hạn hợp đồng ${contractId}`);
        // Thêm logic xử lý gia hạn hợp đồng tại đây

    };


    // Hiển thị thông báo hợp đồng sắp hết hạn
    useEffect(() => {
        if (contracts.length > 0 && isRenewable[openContractIndex]) {
            notification.open({
                message: "Contract Renewal Reminder",
                description: `The contract for room ${
                    contracts[openContractIndex]?.room.roomName
                } is about to expire on ${new Date(
                    contracts[openContractIndex]?.endDate
                ).toLocaleDateString(
                    "en-GB"
                )}. Please renew to avoid interruption.`,
                placement: "topRight",
                duration: 5, // Thời gian hiển thị (5 giây)
                className: "bg-yellow-100 text-yellow-700", // Tuỳ chỉnh style nếu cần
            });
        }
    }, [openContractIndex, contracts, isRenewable]);
    return (
        <div className="bg-[#e0f5e4] text-[#2b6534] h-screen flex flex-col">
            {/* Danh sách các phòng */}
            <div className="h-14 flex flex-row flex-shrink-0 items-center px-4  gap-4 text-xl font-semibold  sticky top-0 z-50 border-b-2 border-gray-300 bg-white">
                {contracts.map((contract, index) => (
                    <span
                        key={contract._id}
                        // className="flex justify-between cursor-pointer"
                        className={`p-2 rounded-lg text-xl font-medium ${
                            openContractIndex === index
                                ? " text-[#49cb5e] underline "
                                : " hover:text-[#49cb5e]"
                        }`}
                        onClick={() => toggleContract(index)}
                    >
                        Room {contract.room.roomName}
                    </span>
                ))}
            </div>
            {/* Hiển thị thông tin hợp đồng */}
            <div className="flex-grow bg-[#e0f5e4] ">
                {contracts.length > 0 && openContractIndex !== -1 && (
                    <div className="">
                        <div className="bg-white rounded-lg shadow-md p-6 m-5">
                            <h2 className="text-2xl font-semibold mb-4">
                                Contract Information
                            </h2>
                            <p className="text-lg">
                                Start Date:{" "}
                                {new Date(
                                    contracts[openContractIndex].startDate
                                ).toLocaleDateString("en-GB")}
                            </p>
                            <p className="text-lg">
                                End Date:{" "}
                                {new Date(
                                    contracts[openContractIndex].endDate
                                ).toLocaleDateString("en-GB")}
                            </p>
                            <p className="text-lg">
                                Status: {contracts[openContractIndex].status}
                            </p>
                        </div>
                        <div className="bg-white  rounded-lg shadow-md p-6 m-5">
                            <h2 className="text-2xl font-semibold mb-4">
                                Landlord Information
                            </h2>
                            <p className="text-lg">
                                Name:{" "}
                                {contracts[openContractIndex].innkeeper.name}
                            </p>
                            <p className="text-lg">Address: Số 7, Quan Trung</p>
                            <p className="text-lg">Phone: 0343310165</p>
                        </div>

                        <div className="bg-white  rounded-lg shadow-md p-6 m-5">
                            <h2 className="text-2xl font-semibold mb-4">
                                Tenant Information
                            </h2>
                            <p className="text-lg">
                                Name: {contracts[openContractIndex].tenant.name}
                            </p>
                            <p className="text-lg">
                                Address:{" "}
                                {contracts[openContractIndex].tenant.address}
                            </p>
                            <p className="text-lg">
                                Phone:{" "}
                                {contracts[openContractIndex].tenant.phone}
                            </p>
                            <p className="text-lg">
                                Email:{" "}
                                {contracts[openContractIndex].tenant.email}
                            </p>
                        </div>

                        <div className="bg-white  rounded-lg shadow-md p-6 m-5">
                            <h2 className="text-2xl font-semibold mb-4">
                                Room Details
                            </h2>
                            <p className="text-lg">
                                Room Name:{" "}
                                {contracts[openContractIndex].room.roomName}
                            </p>
                            <p className="text-lg">Room Type: Quad</p>
                            <p className="text-lg">Area: A</p>
                            <p className="text-lg">
                                Rent Price:{" "}
                                {contracts[openContractIndex].room.price}
                            </p>
                            <p className="text-lg">
                                Amenities: Self-contained room, 45m2, with loft,
                                2 windows, refrigerator, water heater, full
                                kitchen
                            </p>
                        </div>
                        <div className="bg-white  rounded-lg shadow-md p-6 m-5">
                            <h2 className="text-2xl font-semibold mb-4">
                                Payment Terms
                            </h2>
                            <p className="text-lg">
                                Rent:{" "}
                                {contracts[openContractIndex].depositAmount}
                            </p>
                            <p className="text-lg">Deposit: 2.500.000 VND</p>
                            <p className="text-lg">
                                Payment Method: Chuyển khoản
                            </p>
                            <p className="text-lg">Payment Due Date: 13</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-[#e0f5e4] px-4 pb-4">
                <button
                    className={`text-xl text-green-100 p-4 rounded-xl ${
                        isRenewable[openContractIndex]
                            ? "bg-[#259729] hover:bg-[#36c53b]"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isRenewable[openContractIndex]} // Vô hiệu nút nếu chưa hết hạn
                    onClick={() => {
                        handleExtension(contracts[openContractIndex]._id);
                        setOpenAddContract(true);
                    }}
                >
                    Contract extension
                </button>
            </div>
            <ContractExtension
                openAddContract={openAddContract}
                setOpenAddContract={setOpenAddContract}
                contractextension={contracts[openContractIndex]}
            />
        </div>
    );

}
