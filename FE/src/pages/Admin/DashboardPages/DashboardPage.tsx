import RoomStatusBar from "./RoomStatusBar";
import AvailableRoom from "./AvailableRoom";
import UnpaidInvoid from "./UnpaidInvoid";
import InvoiceAmount from "../InvoicePages/InvoiceAmount";

function DashboardPage() {
  return (
    <div className="flex-1">
      <h1 className="font-bold text-2xl m-2">Dashboard</h1>
      <div className={`grid xl:grid-cols-2  `}>
        <div className="m-1 flex-1 flex">
          <InvoiceAmount selectMonth={null} year={null} />
        </div>
        <UnpaidInvoid />
        <RoomStatusBar />
        <AvailableRoom />
      </div>
    </div>
  );
}

export default DashboardPage;
