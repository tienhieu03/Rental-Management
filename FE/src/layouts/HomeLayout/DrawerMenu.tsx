import { Drawer, Menu } from "antd";
import { Link } from "react-router-dom";
import { IRouter } from "../../interfaces";
import { homeAdminRouters } from "../../routers";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface DrawerMenuProps {
  openDrawer: boolean;
  setOpenDrawer: (value: boolean) => void;
  bgColor: string;
  textColor: string;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({
  openDrawer,
  setOpenDrawer,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  return (
    <Drawer
      onClose={() => setOpenDrawer(false)}
      open={openDrawer}
      closeIcon={null}
      closable={false}
      placement="left"
      bodyStyle={{ padding: 0 }} // Xóa khoảng trắng mặc định
    >
      <nav className={`flex flex-col h-full px-1 ${bgColor} ${textColor}`}>
        {/* Header logo */}
        <div className="w-full flex flex-col justify-center items-center py-4">
          <img
            src="https://avatars3.githubusercontent.com/u/12101536?s=400&v=4"
            alt="logo"
            className="w-16 h-16 rounded-full mb-2"
          />
          <span className="text-2xl font-bold text-center">For Admin</span>
        </div>

        {/* Menu điều hướng */}
        <Menu
          mode="inline"
          theme={theme} // Bạn có thể đổi sang "light" nếu muốn
          className={`${bgColor} ${textColor}`}
          onClick={() => setOpenDrawer(false)} // Đóng Drawer khi chọn item
        >
          {homeAdminRouters.map((route: IRouter) =>
            route.children ? (
              <Menu.SubMenu
                key={route.label}
                title={
                  <span className="flex items-center">
                    <i className={`fa ${route.icon} text-lg`} />
                    <span className="ml-4">{route.label}</span>
                  </span>
                }
              >
                {route.children.map((child) => (
                  <Menu.Item key={child.path}>
                    <Link to={`/admin/${route.path}/${child.path}`}>
                      <i className={`fa ${child.icon} text-sm`} />
                      <span className="ml-4">{child.label}</span>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={route.path}>
                <Link to={route.path}>
                  <span className="flex items-center">
                    <i className={`fa ${route.icon} text-lg`} />
                    <span className="ml-4">{route.label}</span>
                  </span>
                </Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </nav>
    </Drawer>
  );
};

export default DrawerMenu;
