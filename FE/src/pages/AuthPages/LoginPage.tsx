import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import { Form, Input, Button, message, Divider, notification } from "antd";
import { useAppDispatch } from "../../redux/hook";
import { loginaction } from "../../redux/slice/auth/authSlice";
import { useState } from "react";
import ResetPasswordPage from "./ResetPasswordPage";
import RetryCodePage from "./RetryCodePage";
import { authtApi } from "../../api";
import { useTheme } from "../../contexts/ThemeContext";

function LoginPage(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const [issubmit, setIsSubmit] = useState<boolean>(false);
  const navigate = useNavigate();
  const [openResetPassword, setOpenResetPassword] = useState<boolean>(false);
  const [openRetryCode, setOpenRetryCode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleLogin = async (value: any) => {
    const { email, password } = value;
    setEmail(email);
    setIsSubmit(true);
    const res = await authtApi.apiLogin(email, password);
    setIsSubmit(false);

    if (res?.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(loginaction(res.data.user));
      message.success("Login successfully!");
      if (res.data.user.role.name === "NORMAL USER") navigate("/user");
      else navigate("/admin");
    } else {
      if (res?.message === "Account has not been activated!") {
        notification.error({
          message: "Error",
          description: res.message,
        });
        setOpenRetryCode(true);
      } else {
        notification.error({ message: "Error", description: res.message });
      }
    }
  };

  return (
    <AuthLayout>
      <div
        className={`p-12 rounded-3xl shadow-xl lg:w-[500px] ${
          theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
        }`}
      >
        <h2 className="text-4xl font-bold text-center mb-8">Login</h2>
        <Divider />
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not a valid email!" },
            ]}
          >
            <Input
              placeholder="Type your email"
              className="text-lg rounded-md border-gray-300"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Type your password"
              className="text-lg rounded-md border-gray-300"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full text-lg bg-red-400 hover:bg-red-500"
              loading={issubmit}
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-end">
          <Button
            size="large"
            type="link"
            onClick={() => setOpenResetPassword(true)}
          >
            Forgot Password ?
          </Button>
        </div>
        <div className="mt-6 text-center">
          <span className="text-gray-400">Don't have an account?</span>
          <Link
            to="/register"
            className={` ${theme === "light" ? "text-black" : "text-white"}
            font-semibold`}
          >
            Register
          </Link>
        </div>
        <ResetPasswordPage
          open={openResetPassword}
          setOpen={setOpenResetPassword}
        />
        <RetryCodePage
          open={openRetryCode}
          setOpen={setOpenRetryCode}
          email={email}
        />
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
