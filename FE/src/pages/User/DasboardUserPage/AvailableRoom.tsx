import { useEffect, useState } from "react";
import { roomApi } from "../../../api";
import { message, Pagination } from "antd";
import { IRoom } from "../../../interfaces";

export default function AvailableRoom() {
    const [rooms, setRooms] = useState<IRoom[]>([]);

    //Phân trang
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const getRoom = async () => {
            const response = await roomApi.fetchRoomApi(
                `pageSize=${pageSize}&currentPage=${current}&status=AVAILABLE`
            );

            if (response.data) {
                setRooms(response.data.result);
                setTotal(response.data.meta.totalDocument);
            } else {
                message.error(response.message);
            }
        };
        getRoom();
    }, [pageSize, current]);

    const handlePaginationChange = (page: number, pageSize?: number) => {
        setCurrent(page);
        if (pageSize) setPageSize(pageSize);
    };
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mx-0 mb-5 sm:mx-5 overflow-x-scroll sm:overflow-x-hidden">
            <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
            <table className="w-full border text-left border-collapse">
                <thead>
                    <tr className="border">
                        <th className="py-2 px-4 border-r">Room Name</th>
                        <th className="py-2 px-4 border-r">Room Price</th>
                        <th className="py-2 px-4 border-r">Room Type</th>
                        <th className="py-2 px-4">Room Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-2 px-4 border-r">
                                {room.roomName}
                            </td>
                            <td className="py-2 px-4 border-r">{room.price}</td>
                            <td className="py-2 px-4 border-r">{room.type}</td>
                            <td className="py-2 px-4">{room.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-start sm:justify-end pt-5 ">
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePaginationChange}
                    showSizeChanger
                />
            </div>
        </div>
    );
}
