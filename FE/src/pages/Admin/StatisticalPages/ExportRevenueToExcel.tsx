import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
interface Props {
  monthlyData: {
    month: string;
    totalAmount: number;
  }[];
}
const ExportRevenueToExcel: React.FC<Props> = ({ monthlyData }) => {
  const exportToExcel = () => {
    // Prepare data for Excel
    const data = monthlyData.map((c) => ({
      Month: c.month,
      TotalAmount: c.totalAmount.toLocaleString() + " đ",
    }));

    // Add title
    const title = [`Revenue Report_${monthlyData[0].month.split("-")[1]}`];
    const header = [["Month", "TotalAmount"]];

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
    worksheet["!cols"] = [{ wch: 20 }, { wch: 20 }];

    // Create workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      ` Revenue Report_${monthlyData[0].month.split("-")[1]} `
    );

    // Export the file
    XLSX.writeFile(
      workbook,
      `RevenueReport_${monthlyData[0].month.split("-")[1]}.xlsx`
    );
  };
  return (
    <div className="   rounded-lg  justify-end flex-1 items-center cursor flex">
      <Button
        onClick={exportToExcel}
        type="primary"
        className="m-2 py-5 px-2 bg-green-600"
      >
        <i className="fa-solid fa-file-export"></i> Export to Excel
      </Button>
    </div>
  );
};

export default ExportRevenueToExcel;
