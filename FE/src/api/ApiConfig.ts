import axios from "axios";
import { ApiMethod } from "../enums";
const baseURL = import.meta.env.VITE_BACKEND_URL; // URL cơ bản của API, được lấy từ biến môi trường
const NO_RETRY_HEADER = "x-no-retry"; // Tên của header dùng để tránh lặp lại việc refresh token
// Tạo instance axios để gọi API
export const apiConfig = axios.create({
  baseURL: baseURL, // Thiết lập URL cơ bản cho mọi yêu cầu
  withCredentials: true, // Đảm bảo cookie được gửi kèm trong các yêu cầu
});
export const apiRequest = (
  method: ApiMethod,
  url: string,
  isMultipart: boolean,
  data?: any
) => {
  const headers = {
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
  };
  return apiConfig({
    method,
    url,
    headers,
    data,
  });
};
// Thêm interceptor cho request (yêu cầu)
apiConfig.interceptors.request.use(
  function (config) {
    // Thực hiện thao tác trước khi gửi yêu cầu
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Xử lý lỗi xảy ra khi gửi yêu cầu
    return Promise.reject(error);
  }
);
// Hàm xử lý refresh token nếu token hết hạn
const handelRefreshToken = async () => {
  const res = await apiConfig.get("/api/v1/auth/refresh"); // Gửi yêu cầu để lấy token mới
  if (res && res.data)
    return res.data.access_token; // Nếu có token mới, trả về token
  else return null; // Nếu không có, trả về null
};
// Thêm interceptor cho response (phản hồi)
apiConfig.interceptors.response.use(
  function (response) {
    // Bất kỳ mã trạng thái nào trong khoảng 2xx sẽ kích hoạt hàm này
    // Xử lý dữ liệu trả về từ phản hồi
    return response && response.data ? response.data : response; // Trả về dữ liệu hoặc toàn bộ phản hồi
  },
  async function (error) {
    // Nếu phản hồi có mã 401 (Unauthorized) và chưa có header NO_RETRY_HEADER
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handelRefreshToken(); // Gọi hàm để lấy token mới
      error.config.headers[NO_RETRY_HEADER] = "true"; // Đặt header để tránh việc lặp lại việc refresh
      if (access_token) {
        error.config.headers["Authorization"] = `Bearer ${access_token}`; // Cập nhật token mới vào header Authorization
        localStorage.setItem("access_token", access_token); // Lưu token mới vào localStorage
        return apiConfig.request(error.config); // Gửi lại yêu cầu với token mới
      }
    }
    if (
      error.response &&
      error.response.status === 400 &&
      error.config.url === "/api/v1/auth/refresh"
    ) {
      // Nếu không lấy được token mới, đăng xuất khỏi hệ thống
      localStorage.removeItem("access_token");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      )
        window.location.href = "/login"; //
    }
    // Xử lý lỗi cho những mã trạng thái không thuộc 2xx
    return error?.response?.data ?? Promise.reject(error); // Trả về dữ liệu lỗi hoặc lỗi được xử lý
  }
);
export default apiConfig; // Xuất đối tượng cấu hình api để sử dụng ở nơi khác
