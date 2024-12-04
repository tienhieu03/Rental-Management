import AvailableRoom from "./AvailableRoom";
import RoomContract from "./RoomContract";

export default function DashboardUserPage() {

    return (
        <div className="bg-[#e0f5e4] text-[#2b6534]  flex flex-col overflow-hidden">
            <RoomContract />
            <AvailableRoom />
        </div>
    );

}
