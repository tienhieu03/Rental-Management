import { IRouter } from "../interfaces";
import ContractUserPage from "../pages/User/ContractUserPage/ContractUserPage";
import DashboardUserPage from "../pages/User/DasboardUserPage/DasboardUserPage";
import InvoiceUserPage from "../pages/User/InvoiceUserPage/InvoiceUserPage";
import PaymentHistoryUserPage from "../pages/User/PaymentHistoryUserPage/PaymentHistoryUserPage";
import ServiceUserPage from "../pages/User/ServiceUserPage/ServiceUserPage";

const homeUserRouters: IRouter[] = [
    {
      path: "dashboardUser",
      component: DashboardUserPage,
      isShowNav: true,
      icon: "fa-chart-simple",
      label: "Dashboard",
    },
    {
      path: "contractUser",
      component: ContractUserPage,
      isShowNav: true,
      icon: "fa-solid fa-file-contract",
      label: "Contract",
    },
    {
      path: "serviceUser",
      component: ServiceUserPage,
      isShowNav: true,
      icon: "fa-brands fa-servicestack",
      label: "Service",
    },
  
    {
      path: "invoiceUser",
      component: InvoiceUserPage,
      isShowNav: true,
      icon: "fa-solid fa-file-invoice-dollar",
      label: "Pay",
    },
    {
      path: "paymentHistory",
      component: PaymentHistoryUserPage,
      isShowNav: true,
      icon: "fa-solid fa-money-check-dollar",
      label: "Payment history",
    },
    // {
    //     path: "paymentSuccessful",
    //     component: PaymentSuccessful,
    //     isShowNav: true,
    //     icon: "fa-solid fa-money-check-dollar",
    //     label: "Payment Successful",
    // },
    // {
    //     path: "paymentFailed",
    //     component: PaymentFailed,
    //     isShowNav: true,
    //     icon: "fa-solid fa-money-check-dollar",
    //     label: "Payment Failed",
    // },
  ];
  export default homeUserRouters