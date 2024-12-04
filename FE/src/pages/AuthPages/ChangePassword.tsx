import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
} from "antd";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../../redux/slice/auth/authSlice";
import { accountApi, authtApi } from "../../api";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const ChangePassword: React.FC<Props> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const enterPassword = async () => {
    setLoading(true); // Start loading

    const values = await form.validateFields();
    if (values.newPassword !== values.confirmPassword) {
      notification.error({
        message: "Error",
        description: "new password is not same confirm password.",
      });

      return;
    }
    const res = await accountApi.changePasswordApi(
      user._id,

      values.confirmPassword,
      values.password
    );
    if (res.statusCode === 201) {
      message.success("Password changed successfully.");

      const respone = await authtApi.apiLogout();
      if (respone && respone.data) {
        dispatch(logoutAction());
        setOpen(false);
        navigate("/");
        message.success(
          "You have successfully changed your password. Please login again."
        );
      } else {
        notification.error({
          message: "Error",
          description: respone.message,
        });
      }
    }

    setLoading(false); // End loading
  };

  return (
    <Modal
      title={
        <h1 className="text-3xl font-bold text-center"> Change Password</h1>
      }
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      footer={null}
    >
      <Divider />

      <div className="mt-12">
        <p className="text-gray-500 mb-4">
          Please enter password and confirm password to change your password.
        </p>
        <Form form={form} name="code">
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              type="password"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password!" },
            ]}
          >
            <Input.Password
              placeholder="Enter your new password"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please enter your confirm password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your confirm password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              onClick={enterPassword}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ChangePassword;
