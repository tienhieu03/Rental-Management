import React from "react";
import { useTheme } from "../contexts/ThemeContext";
interface Props {
  type: "avatar" | "frontIdCard" | "backIdCard" | "temporaryResidence";
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  imageUrl?: string;
}
const RenderUploadField: React.FC<Props> = ({
  type,
  selectedImage,
  setSelectedImage,
  imageUrl,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      console.log(event.target.files[0]);
    }
  };
  const { theme } = useTheme();
  const uniqueId = `${type}-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="flex justify-between my-4">
      <div
        className={`relative ${
          type === "avatar" ? "w-32 h-32" : "w-[210px] h-[150px]"
        }
        `}
      >
        <p
          className={`
        ${theme === "dark" ? "text-white" : "text-black"}
          `}
        >
          {type === "avatar"
            ? null
            : type === "frontIdCard"
            ? "Front ID Card"
            : type === "backIdCard"
            ? "Back ID Card"
            : "Temporary Residence"}
        </p>
        {/* Vòng chứa ảnh */}
        <div
          className={`w-full h-full ${
            type === "avatar" ? "rounded-full" : "rounded-lg"
          } overflow-hidden border border-gray-300 bg-gray-200 flex items-center justify-center`}
        >
          {selectedImage ? (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-full h-full object-cover cursor-pointer"
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Selected"
              className="w-full h-full object-cover cursor-pointer"
            />
          ) : (
            <i
              className={`fa ${
                type === "avatar"
                  ? "fa-user-circle text-6xl"
                  : type === "frontIdCard" || type === "backIdCard"
                  ? "fa-id-card text-4xl"
                  : "fa-file-contract text-4xl"
              } text-gray-400`}
            ></i>
          )}
        </div>
        {/* Biểu tượng máy ảnh để chọn ảnh */}
        <label htmlFor={uniqueId}>
          <div className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full">
            <i className="fa fa-camera text-white p-2"></i>
          </div>
        </label>
        <input
          id={uniqueId}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};
export default RenderUploadField;
