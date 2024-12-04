import { Menu, Dropdown, Button, Space } from "antd";
import { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
interface SortColumn {
  label: string;
  key: string;
}
interface CustomSortProps {
  columns: SortColumn[]; // Danh sách các cột để sắp xếp
  onSort: (key: string) => void; // Hàm xử lý sắp xếp
}
const CustomSort: React.FC<CustomSortProps> = ({ columns, onSort }) => {
  const { theme } = useTheme();
  const renderMenuItems = () =>
    columns.map((column) => (
      <Menu.Item
        key={column.key}
        onClick={() => onSort(column.key)}
        className={`${theme === "light" ? "text-black" : "text-white"}`}
      >
        <span>Sort by {column.label}</span>
      </Menu.Item>
    ));
  const menu = useMemo(
    () => <Menu>{renderMenuItems()}</Menu>,
    [columns, onSort]
  );
  return (
    <Dropdown overlay={menu}>
      <Button className="mx-3 h-10">
        <Space>
          <i className="fa-solid fa-sort text-xl" />
        </Space>
      </Button>
    </Dropdown>
  );
};
export default CustomSort;
