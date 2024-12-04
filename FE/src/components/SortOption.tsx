import { Radio } from "antd";
import React from "react";
import { useTheme } from "../contexts/ThemeContext";
// Định nghĩa kiểu cho các tùy chọn
interface SortOption {
  value: string;
  label: string;
}
// Định nghĩa kiểu cho các props của component
interface SortByProps {
  options: SortOption[];
  onChange: (value: any) => void;
  sorted: string;
}
const SortOption: React.FC<SortByProps> = ({ options, onChange, sorted }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`w-1/2 p-4 rounded-lg shadow-lg  flex flex-col flex-1
      ${
        theme === "light"
          ? "bg-white text-black"
          : "bg-gray-800 text-white hover:bg-gray-700"
      }
    
    `}
    >
      <h2 className="font-bold text-xl my-3 ">Sort By</h2>
      <Radio.Group onChange={onChange} value={sorted}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              className={`font-bold  hover:text-blue-600 transition-colors duration-200
                ${
                  theme === "light"
                    ? "text-black"
                    : "text-white hover:text-blue-300"
                }
                `}
            >
              {option.label}
            </Radio>
          ))}
        </div>
      </Radio.Group>
    </div>
  );
};
export default SortOption;
