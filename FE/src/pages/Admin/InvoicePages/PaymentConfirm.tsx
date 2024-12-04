import { Button, Form, Input, Modal } from "antd";
import React from "react";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}
const PaymentConfirm: React.FC<Props> = ({ open, setOpen }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      className=" justify-center items-center   p-4"
      title="Payment Confirm"
      open={open}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      footer={
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setOpen(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>
          <Button className="ml-4 bg-blue-400 text-white">Save</Button>
        </div>
      }
      width={1000}
    >
      <div className="  p-6  flex flex-1">
        {/* Column 1: Left side with links */}
        <div className="flex flex-col w-1/2 pr-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Payment Setting
          </h1>

          <div className="mb-6 text-left text-gray-600 space-y-4">
            <p className="text-xl">
              Create payOS Account:{" "}
              <a
                href="https://payos.vn/docs/huong-dan-su-dung/tao-tai-khoan-payos/"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                payOS.VN
              </a>
            </p>
            <p className="text-xl">
              Connect payOS with bank account:{" "}
              <a
                href="https://payos.vn/docs/huong-dan-su-dung/ket-noi-tai-khoan/ngan-hang-mb/"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                payOS.VN
              </a>
            </p>
            <p className="text-xl">
              Create payOS API:{" "}
              <a
                href="https://payos.vn/docs/huong-dan-su-dung/tao-kenh-thanh-toan/"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                payOS.VN
              </a>
            </p>
          </div>
        </div>

        {/* Column 2: Right side with form */}
        <div className="w-1/2">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Client ID"
              name="clientId"
              rules={[
                { required: true, message: "Please input your Client ID!" },
              ]}
            >
              <Input.Password placeholder="Enter your Client ID" />
            </Form.Item>

            <Form.Item
              label="API Key"
              name="apiKey"
              rules={[
                { required: true, message: "Please input your API Key!" },
              ]}
            >
              <Input.Password placeholder="Enter your API Key" />
            </Form.Item>

            <Form.Item
              label="Checksum Key"
              name="checksumKey"
              rules={[
                { required: true, message: "Please input your Checksum Key!" },
              ]}
            >
              <Input.Password placeholder="Enter your Checksum Key" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentConfirm;
