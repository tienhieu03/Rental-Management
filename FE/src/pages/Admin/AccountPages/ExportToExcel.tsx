// Excel Export Function
import * as XLSX from "xlsx";
import { Button } from "antd";

import { IAccount } from "../../../interfaces";
interface Props {
  accounts: IAccount[];
}
const ExportToExcel: React.FC<Props> = ({ accounts }) => {
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = accounts.map((c) => ({
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      IdCard: c.idCard,
      Birthday: new Date(c.birthday).toLocaleDateString(),
      Gender: c.gender,
      Address: c.address,
    }));

    // Add title
    const title = [`Account Report`];
    const header = [
      ["Name", "Email", "Phone", "IdCard", "Birthday", "Gender", "Address"],
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
      { wch: 15 }, // Room
      { wch: 50 }, // Tenant
      { wch: 15 }, // Service
      { wch: 15 }, // First Index
      { wch: 15 }, // Final Index
      { wch: 15 }, // Total Usage
      { wch: 50 }, // Price
    ];

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Accounts Report`);

    // Export the file
    XLSX.writeFile(workbook, `AccountReport.xlsx`);
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
