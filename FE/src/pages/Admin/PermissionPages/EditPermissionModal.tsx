import React, { useEffect, useState } from "react";
import { IPermisson } from "../../../interfaces";

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
  openEditPermission: boolean;
  setOpenEditPermission: (value: boolean) => void;
  record: IPermisson | null;
}
const EditPermissionModal: React.FC<Props> = ({
  openEditPermission,
  setOpenEditPermission,
  record,
}) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [form] = Form.useForm();
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        apiPath: record.apiPath,
        method: record.method,
        module: record.module,
      });
    }
  }, [record, form, openEditPermission]);
  const handleOk = async () => {
    setLoading(true);
    const values = await form.validateFields();
    const response = await permissionApi.patchPermissionApi(
      record?._id || "",
      values.name,
      values.apiPath,
      values.method,
      values.module
    );
    if (response.statusCode === 200) {
      message.success("Permission updated successfully");
      form.resetFields();
      setOpenEditPermission(false);
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
      open={openEditPermission}
      onCancel={() => {
        setOpenEditPermission(false);
        form.resetFields(); // Reset form fields
      }}
      onOk={handleOk}
      footer={null}
      width={700}
    >
      <div className={`p-4 ${bgColor} ${textColor}`}>
        <h1 className={`text-3xl font-bold text-center${bgColor} ${textColor}`}>
          Edit Permission
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
              setOpenEditPermission(false);
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

export default EditPermissionModal;
