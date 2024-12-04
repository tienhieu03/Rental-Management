import { useEffect, useState } from "react";

 export const resizeWidth = ()=>{
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };
  
      window.addEventListener("resize", handleResize);// Sự kiện resize
      return () => {
        window.removeEventListener("resize", handleResize);// Xóa sự kiện resize
      };
    }, []);
    return width;
}