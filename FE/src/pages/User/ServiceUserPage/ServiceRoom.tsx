import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hook";
import { IContract, IRegisterService, IService } from "../../../interfaces";
import { contractApi, registerServiceAPI, roomApi } from "../../../api";
import { Button, message } from "antd";

const ServiceRoom = ({
    setServiceRooms,
    serviceRooms,
    selectedRoomId,
    setSelectedRoomId,
}: {
    setServiceRooms: any;
    serviceRooms: any;
    selectedRoomId: string | null;
    setSelectedRoomId: (id: string) => void;
}) => {
    const iduser = useAppSelector((state) => state.auth.user._id);
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [statusRegister, setStatusRegister] = useState<IRegisterService[]>(
        []
    );
    const [loading, setLoading] = useState(false);
    // Fetch danh sách hợp đồng
    const fetchContracts = async () => {
        try {
            const res = await contractApi.fetchContractApi(
                `tenant._id=${iduser}`
            );
            const activeContracts = res.data?.result.filter(
                (contract: IContract) => contract.status === "ACTIVE"
            );
            setContracts(activeContracts || []);
            if (activeContracts?.length > 0 && !selectedRoomId) {
                setSelectedRoomId(activeContracts[0].room._id);
            }
        } catch (error) {
            console.error("Error fetching contracts:", error);
        }
    };

    // Fetch dữ liệu phòng và dịch vụ
    const fetchRoomData = async (roomId: string) => {
        try {
            const res = await roomApi.fetchRoomApi(
                `_id=${roomId}&populate=services`
            );
            const services = res.data?.result[0]?.services || [];
            setServiceRooms(services);

            // Fetch trạng thái đăng ký dịch vụ
            const statusPromises = services.map((service: IService) =>
                registerServiceAPI.fetchRegisterServiceApi(
                    `user=${iduser}&service=${service._id}&room=${roomId}&type=false`
                )
            );
            const statuses = await Promise.all(statusPromises);
            const validStatuses = statuses
                .map((res) => res.data?.result[0])
                .filter((status) => status && status.status !== "SUCCESS");

            setStatusRegister(validStatuses);
        } catch (error) {
            console.error("Error fetching room data:", error);
        }
    };

    // Xóa dịch vụ
    const handleDeleteService = async (
        idService: string,
        serviceType: string
    ) => {
        setLoading(true);
        if (serviceType === "ELECTRICITY" || serviceType === "WATER") {
            message.warning("Cannot delete WATER or ELECTRICITY services.");
            return;
        }
        try {
            const res = await registerServiceAPI.postRegisterServiceApi(
                idService,
                iduser,
                selectedRoomId!,
                false,
                false
            );
            if (res.statusCode === 201) {
                message.success("Cancel service successfully");
                fetchRoomData(selectedRoomId!);
            } else {
                message.error("Failed to cancel service.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            message.error("Error while canceling service.");
        }
        setLoading(false);
    };

    // useEffect để load danh sách hợp đồng
    useEffect(() => {
        fetchContracts();
    }, [iduser]);

    // useEffect để load dữ liệu phòng khi phòng được chọn
    useEffect(() => {
        if (selectedRoomId) {
            fetchRoomData(selectedRoomId);
        }
    }, [selectedRoomId]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-0 mb-5 sm:m-5">
            <h2 className="text-2xl font-semibold mb-4">Current Services</h2>
            {/* Danh sách các phòng */}
            <div className="flex flex-row gap-4 pb-5 text-xl font-semibold">
                {contracts.map((contract) => (
                    <button
                        key={contract._id}
                        className={`px-4 py-2 rounded-lg shadow font-normal text-base ${
                            selectedRoomId === contract.room._id
                                ? "bg-green-300 text-[#2b6534] cursor-pointer font-semibold"
                                : "bg-green-100 hover:bg-green-200"
                        }`}
                        onClick={() => setSelectedRoomId(contract.room._id)}
                    >
                        Phòng {contract.room.roomName}
                    </button>
                ))}
            </div>

            <table className="w-full border text-center border-collapse">
                <thead>
                    <tr className="border">
                        <th className="py-2 px-4 border-r text-lg">
                            Service Name
                        </th>
                        <th className="py-2 px-4 border-r text-lg">Price</th>
                        <th className="py-2 px-4 border-r text-lg">
                            Description
                        </th>
                        <th className="py-2 px-4 text-lg">
                            Cancel registration
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {serviceRooms.map((service: IService, index: number) => {
                        const registerService = statusRegister.find(
                            (reg: IRegisterService) =>
                                reg.service._id === service._id &&
                                reg.room._id === selectedRoomId
                        );
                        return (
                            <tr key={index} className="border-b text-lg">
                                <td className="py-2 px-4 border-r">
                                    {service.serviceName}
                                </td>
                                <td className="py-2 px-4 border-r">
                                    {service.price
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
                                        " đ"}
                                </td>
                                <td className="py-2 px-4 border-r">
                                    {service.description}
                                </td>
                                <td className="py-2 px-4">
                                    {registerService ? (
                                        registerService.status === "PENDING" ? (
                                            <button className="text-lg bg-yellow-300 px-3 py-2 rounded-md text-[#2b6534]">
                                                Pending...
                                            </button>
                                        ) : (
                                            <button className="text-lg bg-orange-300 px-3 py-2 rounded-md text-[#2b6534]">
                                                Approved...
                                            </button>
                                        )
                                    ) : service.type !== "ELECTRICITY" &&
                                      service.type !== "WATER" ? (
                                        <Button
                                            loading={loading}
                                            onClick={() =>
                                                handleDeleteService(
                                                    service._id,
                                                    service.type
                                                )
                                            }
                                            danger
                                            type="primary"

                                            // className="text-red-500 transition-all duration-300 transform hover:text-red-500 hover:scale-110 active:text-red-900 active:scale-95 cursor-pointer"
                                        >
                                            <i className="fa fa-times text-xl   mr-3"></i>
                                            Cancel
                                        </Button>
                                    ) : null}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceRoom;
