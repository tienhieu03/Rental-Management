import { IRouter } from "../interfaces";
import ContractLayout from "../layouts/ContractLayout/ContractLayout";
import ServiceLayout from "../layouts/ServiceLayout/ServiceLayout";
import AccountPage from "../pages/Admin/AccountPages/AccountPage";
import ContractPage from "../pages/Admin/ContractPages/ContractPage";
import ExtendContractPage from "../pages/Admin/ContractPages/ExtendContractPage";
import DashboardPage from "../pages/Admin/DashboardPages/DashboardPage";
import ElectricPage from "../pages/Admin/ElectricPages/ElectricPage";
import InvoicePage from "../pages/Admin/InvoicePages/InvoicePage";
import RolePage from "../pages/Admin/RolePages/RolePage";
import RoomPage from "../pages/Admin/RoomPages/RoomPage";
import RequestServicePage from "../pages/Admin/RequestServicePages/RequestServicePage";
import ServicePage from "../pages/Admin/ServicePages/ServicePage";
import StatisticalPage from "../pages/Admin/StatisticalPages/StatisticalPage";
import WaterPage from "../pages/Admin/WaterPages/WaterPage";
import PermissionPage from "../pages/Admin/PermissionPages/PermissionPage";

const homeAdminRouters: IRouter[] = [
  {
    path: "dashboard",
    component: DashboardPage,
    isShowNav: true,
    icon: "fa-solid fa-chart-pie", // Icon biểu đồ hình tròn cho Dashboard
    label: "Dashboard",
  },
  {
    path: "room",
    component: RoomPage,
    isShowNav: true,
    icon: "fa-solid fa-door-open", // Icon cửa mở cho Room
    label: "Room",
  },
  {
    path: "service",
    component: ServiceLayout,
    isShowNav: true,
    icon: "fa-solid fa-bell", // Icon chuông dịch vụ cho Service
    label: "Service",
    children: [
      {
        path: "serviceList",
        component: ServicePage,
        isShowNav: true,
        icon: "fa-solid fa-th-list", // Icon danh sách cho Service List
        label: "Service List",
      },
      {
        path: "requestService",
        component: RequestServicePage,
        isShowNav: true,
        icon: "fa-solid fa-file-signature", // Icon ký hiệu tài liệu cho Request Service
        label: "Request Service",
      },
    ],
  },
  {
    path: "electricity",
    component: ElectricPage,
    isShowNav: true,
    icon: "fa-solid fa-bolt", // Icon tia sét giữ nguyên
    label: "Electricity",
  },
  {
    path: "water",
    component: WaterPage,
    isShowNav: true,
    icon: "fa-solid fa-tint", // Icon giọt nước cho Water
    label: "Water",
  },
  {
    path: "invoice",
    component: InvoicePage,
    isShowNav: true,
    icon: "fa-solid fa-file-invoice-dollar", // Icon hóa đơn tiền cho Invoice
    label: "Invoice",
  },
  {
    path: "statistical",
    component: StatisticalPage,
    isShowNav: true,
    icon: "fa-solid fa-chart-bar", // Icon biểu đồ cột cho Statistical
    label: "Statistical",
  },
  {
    path: "contract",
    component: ContractLayout,
    isShowNav: true,
    icon: "fa-solid fa-file-contract", // Icon hợp đồng cho Contract Layout
    label: "Contract",
    children: [
      {
        path: "contractList",
        component: ContractPage,
        isShowNav: true,
        icon: "fa-solid fa-folder", // Icon thư mục cho Contract List
        label: "Contract List",
      },
      // {
      //   path: "extendContract",
      //   component: ExtendContractPage,
      //   isShowNav: true,
      //   icon: "fa-solid fa-calendar-plus", // Icon lịch thêm cho Extend Contract
      //   label: "Extend Contract",
      // },
    ],
  },
  {
    path: "account",
    component: AccountPage,
    isShowNav: true,
    icon: "fa-solid fa-user", // Icon người dùng đơn giản cho Account
    label: "Account",
  },
  {
    path: "role",
    component: RolePage,
    isShowNav: true,
    icon: "fa-solid fa-key", // Icon chìa khóa cho Role
    label: "Role",
  },
  {
    path: "permission",
    component: PermissionPage,
    isShowNav: true,
    icon: "fa-solid fa-lock-open", // Icon khóa mở cho Permission
    label: "Permission",
  },
];

export default homeAdminRouters;
