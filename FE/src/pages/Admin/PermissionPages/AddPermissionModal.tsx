import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Select,
  message,
  notification,
} from "antd";
import { useTheme } from "../../../contexts/ThemeContext";
import { permissionApi } from "../../../api";
import { ApiMethod } from "../../../enums";
interface Props {
  openAddPermission: boolean;
  setOpenAddPermission: (value: boolean) => void;
}
const AddPermissionModal: React.FC<Props> = ({
  openAddPermission,
  setOpenAddPermission,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const handleOk = async () => {
    setLoading(true);
    // Validate the form fields
    const values = await form.validateFields();
    const response = await permissionApi.postPermissionApi(
      values.name,
      values.apiPath,
      values.method,
      values.module
    );
    if (response.statusCode === 201) {
      message.success("Permission added successfully");
      form.resetFields(); // Reset form fields
      //   dispatch(addServiceAction(values))
      setOpenAddPermission(false); // Close modal on success
    } else {
      notification.error({
        message: "Error",
        description: response.message,
      });
    }
    setLoading(false);
  };
  return (
    <Modal
      closable={false}
      centered
      open={openAddPermission}
      onCancel={() => {
        setOpenAddPermission(false);
        form.resetFields(); // Reset form fields
      }}
      onOk={handleOk}
      footer={null}
      width={700}
    >
      <div className={`p-4 ${bgColor} ${textColor}`}>
        <h1 className={`text-3xl font-bold text-center${bgColor} ${textColor}`}>
          Add Permission
        </h1>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<span className={` ${textColor} `}>Permission Name</span>}
            name="name"
            rules={[
              { required: true, message: "Please input permission name!" },
            ]}
          >
            <Input placeholder="Permission Name" />
          </Form.Item>
          <Form.Item
            label={<span className={` ${textColor} `}>API Path</span>}
            name="apiPath"
            rules={[{ required: true, message: "Please input API path!" }]}
          >
            <Input placeholder="API Path" />
          </Form.Item>
          <Form.Item
            label={<span className={` ${textColor} `}>Method</span>}
            name="method"
            rules={[{ required: true, message: "Please input method!" }]}
          >
            <Select>
              {Object.values(ApiMethod).map((method) => (
                <Select.Option value={method}>{method}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className={` ${textColor} `}>Module</span>}
            name="module"
            rules={[{ required: true, message: "Please input module!" }]}
          >
            <Input placeholder="Module" />
          </Form.Item>
        </Form>
        <div className="mt-4 flex-1 justify-end text-end">
          <Button
            key="back"
            onClick={() => {
              setOpenAddPermission(false);
              form.resetFields(); // Reset form fields
            }}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
          >
            <p className="font-xl text-white flex">Add</p>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default AddPermissionModal;
