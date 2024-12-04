import { useEffect, useState, useCallback } from "react";
import { message, Pagination } from "antd";
import { IRegisterService, IService } from "../../../interfaces";
import { serviceApi, registerServiceAPI } from "../../../api";
import RegisterService from "./RegisterService";
import { useAppSelector } from "../../../redux/hook";

export default function AvailableService({
    registeredServices,
    selectedRoomId,
}: {
    registeredServices: IService[];
    selectedRoomId: any;
}) {
    const [services, setServices] = useState<IService[]>([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<IService | null>(
        null
    );
    const [statusRegister, setStatusRegister] = useState<IRegisterService[]>(
        []
    );
    const [type, setType] = useState(false);

    const idUser = useAppSelector((state) => state.auth.user._id);

    const fetchAvailableServices = useCallback(async () => {
        try {
            const response = await serviceApi.fetchServiceApi(
                `pageSize=99999&currentPage=1`
            );

            if (response.data) {
                const availableServices = response.data.result.filter(
                    (service: IService) =>
                        !registeredServices.some(
                            (registered: IService) =>
                                registered._id === service._id
                        )
                );
                setServices(availableServices);
                setTotal(response.data.total);

                // Fetch trạng thái đăng ký song song
                const statusResponses = await Promise.all(
                    availableServices.map((service: IService) =>
                        registerServiceAPI.fetchRegisterServiceApi(
                            `user=${idUser}&service=${service._id}&room=${selectedRoomId}&type=true`
                        )
                    )
                );

                const statuses = statusResponses
                    .map((res) => res.data.result[0])
                    .filter((status) => status && status.status !== "SUCCESS");

                setStatusRegister(statuses);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error("Failed to load services.");
        }
    }, [
        current,
        pageSize,
        registeredServices,
        selectedRoomId,
        idUser,
        isModalOpen,
    ]);

    useEffect(() => {
        fetchAvailableServices();
    }, [fetchAvailableServices]);

    const handlePaginationChange = (page: number, pageSize?: number) => {
        setCurrent(page);
        if (pageSize) setPageSize(pageSize);
    };

    const handleRegisterClick = (service: IService) => {
        setSelectedService(service);
        setType(true);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mx-0 mb-5 sm:mx-5 sm:overflow-x-hidden overflow-x-scroll flex-grow">
            <h2 className="text-xl font-semibold mb-4">Unregistered Service</h2>
            <table className="w-full border text-center border-collapse">
                <thead>
                    <tr className="border">
                        <th className="py-2 px-4 border-r">Service Name</th>
                        <th className="py-2 px-4 border-r">Price</th>
                        <th className="py-2 px-4 border-r">Description</th>
                        <th className="py-2 px-4">Register</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => {
                        const registerService = statusRegister.find(
                            (status) => status.service._id === service._id
                        );

                        return (
                            <tr key={service._id} className="border-b">
                                <td className="py-2 px-4 border-r">
                                    {service.serviceName}
                                </td>
                                <td className="py-2 px-4 border-r">
                                    {service.price.toLocaleString()} đ
                                </td>
                                <td className="py-2 px-4 border-r">
                                    {service.description}
                                </td>
                                <td className="py-2 px-4 text-center">
                                    {registerService &&
                                    registerService.room._id ===
                                        selectedRoomId ? (
                                        registerService.status === "PENDING" ? (
                                            <button className="text-lg bg-yellow-300 px-3 py-2 rounded-md text-[#2b6534]">
                                                Pending...
                                            </button>
                                        ) : (
                                            <button className="text-lg bg-orange-300 px-3 py-2 rounded-md text-[#2b6534]">
                                                Approved...
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            className="px-4 py-2 rounded bg-green-500 text-lg transition-all duration-300 transform hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-green-700"
                                            onClick={() =>
                                                handleRegisterClick(service)
                                            }
                                        >
                                            Register
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {isModalOpen && selectedService && (
                <RegisterService
                    setIsModalVisible={setIsModalOpen}
                    handleCancel={() => setIsModalOpen(false)}
                    isModalOpen={isModalOpen}
                    title="Register Service"
                    selectedService={selectedService}
                    selectedRoomId={selectedRoomId}
                    type={type}
                />
            )}
        </div>
    );
}
