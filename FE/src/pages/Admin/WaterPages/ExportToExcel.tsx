// Excel Export Function
import * as XLSX from "xlsx";
import { Button } from "antd";
import { IContract, IService } from "../../../interfaces";
interface Props {
  contract: IContract[];
  numberIndex: {
    [key: string]: {
      firstIndex: number;
      finalIndex: number;
      invoiceId: string;
    };
  };
  selectedMonth: number;
  year: number;
  water: IService;
}
const ExportToExcel: React.FC<Props> = ({
  contract,
  numberIndex,
  selectedMonth,
  year,
  water,
}) => {
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = contract.map((c) => ({
      Room: c.room.roomName,
      Tenant: c.tenant.name,
      "First Index": numberIndex[c._id]?.firstIndex || 0,
      "Final Index": numberIndex[c._id]?.finalIndex || 0,
      "Total Usage":
        (numberIndex[c._id]?.finalIndex || 0) -
        (numberIndex[c._id]?.firstIndex || 0),
      Price: Number(water.price).toLocaleString(),
      Total: Number(
        Number(water.price) *
          ((numberIndex[c._id]?.finalIndex || 0) -
            (numberIndex[c._id]?.firstIndex || 0))
      ).toLocaleString(),
    }));

    // Add title
    const title = [`Water Usage Report - ${selectedMonth}/${year}`];
    const header = [
      [
        "Room",
        "Tenant",
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
      `Water Usage ${selectedMonth}-${year}`
    );

    // Export the file
    XLSX.writeFile(workbook, `WaterUsage_${selectedMonth}-${year}.xlsx`);
  };
  return (
   
      <Button
        onClick={exportToExcel}
        className="m-4 py-6 px-2 bg-green-600 text-white "
      >
        <i className="fa-solid fa-file-export"></i> Export to Excel
      </Button>
  
  );
};
export default ExportToExcel;
