import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { IRouter } from "../../interfaces";
import { homeAdminRouters } from "../../routers";
import { MenuProps } from "antd";
import { useTheme } from "../../contexts/ThemeContext";

interface NavMenuProps {
  isNavOpen: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ isNavOpen }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";

  // Render danh sách menu
  const renderMenuItems = (routes: IRouter[]) =>
    routes
      .filter((route) => route.label)
      .map((route) =>
        route.children ? (
          <Menu.SubMenu
            key={route.label}
            title={isNavOpen ? route.label : null} // Hiển thị tiêu đề chỉ khi menu mở
            icon={<i className={`fa ${route.icon} text-lg`} />}
          >
            {route.children.map((child) => (
              <Menu.Item key={child.label}>
                <Link to={`/admin/${route.path}/${child.path}`}>
                  {child.icon && <i className={`fa ${child.icon} mr-2`} />}
                  {child.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key={route.label}
            icon={<i className={`fa ${route.icon} text-lg`} />}
          >
            <Link to={route.path}>{isNavOpen ? route.label : null}</Link>
          </Menu.Item>
        )
      );

  return (
    <div
      className={`transition-all duration-300 ${
        isNavOpen ? "w-[200px]" : "w-20"
      } h-full ${bgColor} ${textColor}`}
    >
      <div className="flex flex-col items-center py-4 border-b">
        <img
          src="https://avatars3.githubusercontent.com/u/12101536?s=400&v=4"
          alt="logo"
          className="w-12 h-12 rounded-full"
        />
        {isNavOpen && <span className="mt-2 font-bold">For Admin</span>}
      </div>
      <Menu
        className={`${bgColor} ${textColor}`} // Thêm lớp cho màu nền và màu chữ
        mode={isNavOpen ? "inline" : "vertical"} // Chuyển sang chế độ vertical khi thu gọn
        theme={theme === "light" ? "light" : "dark"}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {renderMenuItems(homeAdminRouters)}
      </Menu>
    </div>
  );
};

export default NavMenu;
