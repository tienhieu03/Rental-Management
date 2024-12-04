import { useEffect, useState } from "react";


import { useAppSelector } from "../../../redux/hook";
import { IContract, IRoom } from "../../../interfaces";
import { contractApi, roomApi } from "../../../api";


export default function RoomContract() {
    const [rooms, setRoom] = useState<IRoom>();

    const iduser = useAppSelector((state) => state.auth.user._id);
    const [contracts, setContracts] = useState<IContract[]>([]);
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

                setContracts(activeContracts);

                // Nếu chưa có phòng được chọn, mặc định chọn phòng đầu tiên
                if (activeContracts.length > 0 && !selectedRoomId) {
                    setSelectedRoomId(activeContracts[0].room._id);
                }
            }

            console.log(res);
        };
        getContracts();
    }, [iduser, selectedRoomId]);


    useEffect(() => {
        // Only fetch room data when contract is available
        const fetchRoomData = async () => {

            // if (contract && contract[0].room) {
            if(selectedRoomId){
            const res2 = await roomApi.fetchRoomByIdApi(selectedRoomId);
            if (res2.data) {
                const roomData = res2.data;
                setRoom(roomData);
            }
        }
            // }
        };

        fetchRoomData();
    }, [selectedRoomId]); // Runs when contract changes

    // useEffect(() => {
    //     const fetchRoomData = async () => {
    //         if (selectedRoomId) {
    //             // Chỉ fetch khi idRoom tồn tại
    //             const res = await roomApi.fetchRoomByIdApi(selectedRoomId);
    //             if (res.data) {
    //                 setRoom(res.data);
    //             }
    //         } else {
    //             // setRoom(null); // Reset room khi không có idRoom

    //         }
    //     };

    //     fetchRoomData();

    // }, [selectedRoomId]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mx-0  sm:mx-5 mb-5 sm:mt-5">
            <h2 className="text-3xl font-semibold mb-4">Room Information</h2>

            {/* Danh sách các phòng */}
            <div className="flex flex-row gap-4  text-xl font-semibold border-b pb-2 ">
                {contracts.map((contract, index) => (
                    <button
                        key={contract._id}
                        className={`px-4 py-2 rounded-lg shadow-md font-normal text-base  ${
                            selectedRoomId === contract.room._id
                                ? "bg-green-300 text-[#2b6534] cursor-pointer font-semibold"
                                : "bg-green-100 hover:bg-green-200"
                        }`}
                        onClick={() => {
                            setSelectedRoomId(contract.room._id);
                        }}
                    >
                        Phòng {contract.room.roomName}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-10">
                <div className="text-lg ">
                    <p className=" py-2 ">
                        Room Name: <span className="">{rooms?.roomName}</span>
                    </p>
                    <p className=" py-2 ">
                        Room Type: <span className="">{rooms?.type}</span>
                    </p>
                    <p className=" py-2 ">
                        Room Price: <span className="">{rooms?.price}</span>
                    </p>
                    <p className=" py-2 ">
                        Room Description:{" "}
                        <span className="">{rooms?.description}</span>
                    </p>
                </div>
            </div>
        </div>
    );

}

