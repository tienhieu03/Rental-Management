// SearchFilters.tsx

import { DatePicker, Input, Select, Space } from "antd";
import { useTheme } from "../contexts/ThemeContext";
const { Option } = Select;
interface Field {
  label: string; // Label của trường
  field: string; // Tên trường trong dữ liệu
  type: "text" | "select" | "date"; // Kiểu input: text hoặc select
  options?: { value: string; label: string }[]; // Chỉ dùng khi type là select
}
interface SearchFiltersProps {
  searchParams: any;
  onSearchChange: (field: string, value: string) => void;
  fields: Field[]; // Truyền vào các trường tìm kiếm
}
const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchParams,
  onSearchChange,
  fields,
}) => {
  const { theme } = useTheme();
  return (
    <div
      className={`w-1/2 p-4 rounded-lg  shadow-lg   flex flex-wrap
    ${
      theme === "light"
        ? "bg-white text-black"
        : "bg-gray-800 text-white hover:bg-gray-700"
    }
    `}
    >
      <h2 className="font-bold text-xl my-3 mr-4 w-full">Search</h2>
      <Space direction="horizontal" wrap>
        {fields.map((field) => {
          if (field.type === "text") {
            return (
              <Input
                size="large"
                key={field.field}
                placeholder={`Search by ${field.label}`}
                value={searchParams[field.field]}
                onChange={(e) => onSearchChange(field.field, e.target.value)}
              />
            );
          }
          if (field.type === "select") {
            return (
              <Select
                size="large"
                key={field.field}
                placeholder={`Select ${field.label}`}
                value={searchParams[field.field]}
                onChange={(value) => onSearchChange(field.field, value)}
                className="flex-1 m-2 w-full sm:w-40" // Responsive width
              >
                {field.options?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            );
          }
          if (field.type === "date") {
            return (
              <DatePicker
                key={field.field}
                placeholder={`Search by ${field.label}`}
                value={searchParams[field.field]}
                onChange={(date) =>
                  onSearchChange(field.field, date?.format("YYYY-MM-DD") || "")
                }
                className="flex-1 m-2 w-full sm:w-60" // Responsive width
              />
            );
          }
          return null;
        })}
      </Space>
    </div>
  );
};
export default SearchFilters;
