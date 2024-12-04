// Excel Export Function
import * as XLSX from "xlsx";
import { Button } from "antd";
import { IContract } from "../../../interfaces";
interface Props {
  contracts: IContract[];
}
const ExportToExcel: React.FC<Props> = ({ contracts }) => {
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = contracts.map((c) => ({
      Name: c.tenant.name,

      Phone: c.tenant.phone,
      IdCard: c.tenant.idCard,
      Room: c.room.roomName,
      Price: c.room.price.toLocaleString() + " đ",
      Innkeeper: c.innkeeper.name,
      Status: c.status,
      StartDate: new Date(c.startDate).toLocaleDateString(),
      EndDate: new Date(c.endDate).toLocaleDateString(),
      depositAmount: c.depositAmount.toLocaleString() + " đ",
    }));
    // Add title
    const title = [`Contract Report`];
    const header = [
      [
        "Name",
        "Phone",
        "IdCard",
        "Room",
        "Price",
        "Innkeeper",
        "Status",
        "StartDate",
        "EndDate",
        "DepositAmount",
      ],
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
      { wch: 25 }, // Name
      { wch: 15 }, // Phone
      { wch: 15 }, // IdCard
      { wch: 15 }, // Room
      { wch: 15 }, // Price
      { wch: 15 }, // Innkeeper
      { wch: 15 }, // Status
      { wch: 15 }, // StartDate
      { wch: 15 }, // EndDate
      { wch: 15 }, // DepositAmount
    ];

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, ` Contracts Report`);

    // Export the file
    XLSX.writeFile(workbook, `ContractReport.xlsx`);
  };
  return (
    <div className="   rounded-lg  justify-end flex-1 items-center cursor flex">
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
