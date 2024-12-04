// Excel Export Function
import * as XLSX from "xlsx";
import { Button } from "antd";
import { IPermisson } from "../../../interfaces";

interface Props {
  permissions: IPermisson[];
}
const ExportToExcel: React.FC<Props> = ({ permissions }) => {
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = permissions.map((c) => ({
      Name: c.name,
      ApiPath: c.apiPath,
      Method: c.method,
      Module: c.module,
    }));
    //Add title
    const title = [`Permission Report`];
    const header = [["Name", "ApiPath", "Method", "Module"]];
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
    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Name
      { wch: 15 }, // ApiPath
      { wch: 15 }, // Method
      { wch: 15 }, // Module
    ];
    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Permission Report`);
    // Export the file
    XLSX.writeFile(workbook, `PermissionReport.xlsx`);
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
