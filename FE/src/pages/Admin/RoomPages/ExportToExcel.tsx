// Excel Export Function
import * as XLSX from "xlsx";
import { Button } from "antd";
import { IRoom } from "../../../interfaces";
interface Props {
  rooms: IRoom[];
}
const ExportToExcel: React.FC<Props> = ({ rooms }) => {
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = rooms.map((c) => ({
      RoomName: c.roomName,
      RoomType: c.type,
      Area: c.area,
      Price: Number(c.price).toLocaleString(),
      Status: c.status,
      Description: c.description,
    }));

    // Add title
    const title = [`Room Report`];
    const header = [
      ["Room Name", "Room Type", "Area", "Price", "Status", "Description"],
    ];

    // Create worksheet and add title and headers
    const worksheet = XLSX.utils.aoa_to_sheet([
      title,
      ...header,
      ...data.map(Object.values),
    ]);

    // Set title and header style
    worksheet["A1"].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: "center" },
    };
    worksheet["A2"].s = {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: "center" },
    };

    // Merge title cells
    //  worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];  //đây là dòng 0, cột 0 đến dòng 0, cột 4

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Room Name
      { wch: 15 }, // Room Type
      { wch: 15 }, // Area
      { wch: 15 }, // Price
      { wch: 15 }, // Status
      { wch: 50 }, // Description
      { wch: 50 }, // Service
    ];

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Rooms Report`);

    // Export the file
    XLSX.writeFile(workbook, `RoomReport.xlsx`);
  };
  return (
    <div className="  rounded-lg  justify-end flex-1 items-center cursor flex">
      <Button
        onClick={exportToExcel}
        className="m-2 py-6 px-2 bg-green-600 text-white "
      >
        <i className="fa-solid fa-file-export"></i> Export to Excel
      </Button>
    </div>
  );
};
export default ExportToExcel;
