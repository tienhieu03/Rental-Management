import { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { getUserAction } from "./redux/slice/auth/authSlice";
import HomeLayout from "./layouts/HomeLayout/HomeLayout";
import { NotFoundPage, Loading } from "./components";
import { homeUserRouters, homeAdminRouters } from "./routers";

import { notification } from "antd";
import UserLayout from "./layouts/UserLayout/UserLayout";
import DashboardPage from "./pages/Admin/DashboardPages/DashboardPage";
import LoginPage from "./pages/AuthPages/LoginPage";
import RegisterPage from "./pages/AuthPages/RegisterPage";

import DashboardUserPage from "./pages/User/DasboardUserPage/DasboardUserPage";
import { authtApi } from "./api";
import ProtectedRouter from "./routers/ProtectedRouter";

// Router setup moved outside to avoid re-creating it on every render

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.user.role.name);
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (
        <ProtectedRouter.ProtectedAdminRoute>
          <HomeLayout />
        </ProtectedRouter.ProtectedAdminRoute>
      ),
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <DashboardPage /> },
        ...homeAdminRouters.map((route) => ({
          path: route.path,
          element: <route.component />, // Render route components dynamically
          children: route.children?.map((childRoute) => ({
            path: childRoute.path,
            element: <childRoute.component />,
          })),
        })),
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: isAuthenticated ? (
        role === "NORMAL USER" ? (
          <Navigate to="/user" replace />
        ) : (
          <Navigate to="/admin" replace />
        )
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/user",
      element: <UserLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <DashboardUserPage /> },
        ...homeUserRouters.map((route: any) => ({
          path: route.path,
          element: <route.component />, // Assuming correct JSX element rendering
        })),
      ],
    },
  ]);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      return;
    }
    const res = await authtApi.apiFetchUser();

    if (res?.data) {
      console.log(res.data);
      dispatch(getUserAction(res.data.user));
    } else
      notification.error({
        message: "Error",
        description: res.message,
      });
  };

  useEffect(() => {
    // Only fetch the user account if authenticated and not on the login page
    getAccount();
  }, []); // Correct dependencies
  // Conditional rendering logic simplified
  if (
    isAuthenticated === true ||
    window.location.pathname === "/login" ||
    window.location.pathname === "/register"
  ) {
    return <RouterProvider router={router} />;
  } else {
    return <Loading />;
  }
}

export default App;
