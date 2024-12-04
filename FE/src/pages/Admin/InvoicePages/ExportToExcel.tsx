// Excel Export Function
import * as XLSX from "xlsx";
import { Button } from "antd";
import { IInvoice } from "../../../interfaces";

interface Props {
  invoices: IInvoice[];
}
const ExportToExcel: React.FC<Props> = ({ invoices }) => {
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = invoices.map((c) => ({
      Room: c.room.roomName,
      Tenant: c.tenant.name,
      Service: c.service.name,
      "First Index": c.firstIndex || "",
      "Final Index": c.finalIndex || "",
      "Total Usage": c.totalNumber || "",
      Price: Number(c.service.priceUnit).toLocaleString(),
      Total: Number(c.amount).toLocaleString(),
    }));

    // Add title
    const title = [`Invoice Report - ${invoices[0]?.month || ""}`];
    const header = [
      [
        "Room",
        "Tenant",
        "Service",
        "First Index",
        "Final Index",
        "Total Usage",
        "Price",
        "Total",
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
      { wch: 15 }, // Room
      { wch: 20 }, // Tenant
      { wch: 15 }, // Service
      { wch: 15 }, // First Index
      { wch: 15 }, // Final Index
      { wch: 15 }, // Total Usage
      { wch: 20 }, // Price
      { wch: 20 }, // Total
    ];

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Invoices Usage ${invoices[0]?.month || ""}`
    );

    // Export the file
    XLSX.writeFile(workbook, `Invoices_${invoices[0]?.month || ""}.xlsx`);
  };
  return (
    <Button
      onClick={exportToExcel}
      className="m-2 py-6 px-2 bg-green-600 text-white "
    >
      <i className="fa-solid fa-file-export"></i> Export to Excel
    </Button>
  );
};
export default ExportToExcel;
