import React, { useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Steps,
} from "antd";
import { authtApi } from "../../api";
import { useTheme } from "../../contexts/ThemeContext";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const ResetPasswordPage: React.FC<Props> = ({ open, setOpen }) => {
  const [formEmail] = Form.useForm();
  const [formCode] = Form.useForm();
  const [id, setId] = useState<string>("");
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const getCode = async () => {
    setLoading(true); // Start loading

    const values = await formEmail.validateFields();
    const email = values.email;

    const res = await authtApi.retryCode(email);
    if (res.statusCode === 201) {
      setId(res.data._id);
      setCurrent(current + 1);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }

    setLoading(false); // End loading
  };
  const resetPassword = async () => {
    setLoading(true); // Start loading

    const values = await formCode.validateFields();

    if (values.password !== values.confirmPassword) {
      notification.error({
        message: "Error",
        description: "Password and Confirm Password must be the same.",
      });

      return;
    }
    const res = await authtApi.apiResetPassword(
      id,
      values.code,
      values.password
    );
    if (res.statusCode === 201) {
      message.success("Password reset successfully.");
      setCurrent(current + 1);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }

    setLoading(false); // End loading
  };
  const EnterEmail = () => (
    <div className="mt-12">
      <p className=" mb-4">Please enter your email address.</p>
      <Form form={formEmail}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" size="large" />
        </Form.Item>
      </Form>
      <Button size="large" type="primary" onClick={getCode} loading={loading}>
        Submit
      </Button>
    </div>
  );

  const EnterPassword = () => (
    <div className="mt-12">
      <p className=" mb-4">
        A code has been sent to your email address. Please enter the code to
        reset your password.
      </p>
      <Form form={formCode}>
        <Form.Item
          name="code"
          rules={[{ required: true, message: "Please input your code!" }]}
        >
          <Input placeholder="Code" size="large" />
        </Form.Item>
        <p className={`mb-4 ${textColor}`}>Please enter your new password.</p>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="New Password" size="large" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Confirm Password" size="large" />
        </Form.Item>
      </Form>
      <Button size="large" type="primary" onClick={resetPassword}>
        Submit
      </Button>
    </div>
  );

  const Done = () => (
    <div className="mt-12 flex flex-col items-center">
      <i className="fa-solid fa-circle-check text-[100px] text-blue-500 mb-4"></i>
      <p className="">Your password has been reset successfully.</p>
      <Button
        size="large"
        type="primary"
        onClick={() => {
          setOpen(false);
          setCurrent(0);
        }}
        className="mt-4"
      >
        Go back to login
      </Button>
    </div>
  );

  const steps = [
    {
      title: (
        <span
          className={` 
           ${textColor}
        `}
        >
          Enter Email
        </span>
      ),
      content: <EnterEmail />,
      icon: <i className="fa-solid fa-envelope" />,
    },
    {
      title: (
        <span
          className={` 
           ${textColor}
        `}
        >
          Enter Code
        </span>
      ),
      content: <EnterPassword />,
      icon: <i className="fa-solid fa-lock" />,
    },
    {
      title: (
        <span
          className={` 
           ${textColor}
        `}
        >
          Done
        </span>
      ),
      content: <Done />,
      icon: <i className="fa-solid fa-check" />,
    },
  ];

  return (
    <Modal
      closable={false}
      open={open}
      centered
      onCancel={() => {
        setOpen(false);
        setCurrent(0);
      }}
      footer={null}
    >
      <div
        className={`p-4
      ${bgColor} ${textColor}
    `}
      >
        <h2 className="text-4xl font-bold text-center mb-8">Reset Password</h2>
        <Divider />
        <Steps current={current}>
          {steps.map((item, index) => (
            <Steps.Step
              key={index}
              title={item.title}
              icon={item.icon}
              className="flex"
            />
          ))}
        </Steps>
        <div className="mt-8">{steps[current].content}</div>
      </div>
    </Modal>
  );
};

export default ResetPasswordPage;
