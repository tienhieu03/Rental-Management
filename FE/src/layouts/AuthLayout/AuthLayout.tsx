import { useTheme } from "../../contexts/ThemeContext";

interface Props {
  children: React.ReactNode;
}

function AuthLayout({ children }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  return (
    <div
      className={`min-h-screen  ${bgColor} ${textColor} 
           `}
    >
      {/* Nút chuyển đổi theme */}
      <div className="flex justify-end pr-6 pt-2  lg:mb-[100px] w-full">
        <i
          className={`fa-solid  text-2xl cursor-pointer hover:opacity-80 ${
            theme === "light" ? "fa-sun text-black" : "text-white fa-moon"
          }`}
          onClick={toggleTheme}
        />
      </div>
      {/* Layout chính */}
      <div className="flex flex-col md:flex-row items-center md:h-full">
        {/* Phần bên trái */}
        <div className="flex flex-1 flex-col items-center justify-center md:w-1/2 p-10">
          <img
            src="https://avatars3.githubusercontent.com/u/12101536?s=400&v=4"
            alt="logo"
            className="w-20 h-20 md:w-40 md:h-40 lg:w-60 lg:h-60 rounded-full mb-4"
          />
          <p className="text-2xl md:text-4xl lg:text-6xl font-bold text-center">
            Boarding House Management
          </p>
          <div className="flex-1" />
        </div>
        {/* Phần bên phải */}
        <div className="flex-1 flex justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
