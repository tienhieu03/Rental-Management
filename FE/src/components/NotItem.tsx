import { Result } from "antd";
import { useTheme } from "../contexts/ThemeContext";
function NotItem() {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";

  return (
    <div className="flex-1 flex justify-center items-center">
      <Result
        className="flex-1"
        status="info" // Trạng thái hiển thị
        title={
          <p
            className={`text-2xl font-bold
        ${textColor}
          `}
          >
            No Data Found
          </p>
        }
        subTitle={
          <p
            className={`text-xl font-bold
            ${textColor}
              `}
          >
            No data can be found, please add new data
          </p>
        }
        icon={
          <i className="fa-solid fa-face-sad-tear text-9xl text-red-400"></i>
        }
      />
    </div>
  );
}
export default NotItem;
