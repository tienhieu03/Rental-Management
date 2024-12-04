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
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { authtApi } from "../../api";
import { useTheme } from "../../contexts/ThemeContext";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}
const ActiveAccountPage: React.FC<Props> = ({ open, setOpen, id }) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const navigate = useNavigate();
  const [formCode] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const activateAccount = async () => {
    setLoading(true); // Start loading

    const values = await formCode.validateFields();
    const code = values.code;

    const res = await authtApi.apiActiveAccount(id, code);
    if (res.statusCode === 201) {
      message.success("Account activated successfully.");
      setCurrent(current + 1);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }

    setLoading(false); // End loading
  };

  const EnterCode = () => (
    <div
      className={`mt-12
      ${bgColor} ${textColor}
    `}
    >
      <p className=" mb-4">
        A code has been sent to your email address. Please enter the code to
        activate your account.
      </p>
      <Form form={formCode}>
        <Form.Item
          name="code"
          rules={[{ required: true, message: "Please input your code!" }]}
        >
          <Input placeholder="Code" size="large" />
        </Form.Item>
      </Form>
      <Button
        type="primary"
        onClick={activateAccount}
        loading={loading}
        disabled={loading}
        size="large"
      >
        Submit
      </Button>
    </div>
  );

  const Done = () => (
    <div className="mt-12 flex flex-col items-center">
      <i className="fa-solid fa-circle-check text-[100px] text-blue-500 mb-4"></i>
      <p className="">Your account has been activated successfully.</p>
      <Button
        size="large"
        type="primary"
        onClick={() => {
          setOpen(false);
          setCurrent(0);
          navigate("/login");
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
          ${bgColor} ${textColor}
        `}
        >
          Enter Code
        </span>
      ),
      content: <EnterCode />,
      icon: <i className="fa-solid fa-lock" />,
    },
    {
      title: (
        <span
          className={` 
          ${bgColor} ${textColor}
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
        <h2 className="text-4xl font-bold text-center  mb-8">
          Activate Account
        </h2>
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

export default ActiveAccountPage;
