// TableComponent.tsx
import React from "react";
import { Table } from "antd";
import { useTheme } from "../contexts/ThemeContext";
interface TableComponentProps {
  data: any[];
  columns: any[];
  visibleColumns: string[];
  isLoading: boolean;
  current: number;
  pageSize: number;
  total: number;
  onChange: (pagination: any) => void;
}
const TableComponent: React.FC<TableComponentProps> = ({
  data,
  columns,
  visibleColumns,
  isLoading,
  current,
  pageSize,
  total,
  onChange,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  return (
    <Table
      className={`
        ${textColor} ${bgColor}
        `}
      rowKey={(record) => record._id}
      loading={isLoading}
      dataSource={data}
      columns={columns.filter((column) =>
        visibleColumns.includes(column.dataIndex)
      )}
      pagination={{
        current: current,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 100, 200, 999999],
      }}
      //scroll={{ x: 800 }}
      onChange={onChange}
      rowClassName={`
       ${bgColor} hover:text-black ${textColor}
      `} // Added class for row hover styling
    />
  );
};
export default TableComponent;
