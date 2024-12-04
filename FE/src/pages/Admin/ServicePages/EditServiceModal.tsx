import React, { useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  message,
  Select,
  notification,
} from "antd";
import { IService } from "../../../interfaces";
import { ServiceType, UnitService } from "../../../enums";
import { serviceApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  openEditService: boolean;
  setOpenEditService: (value: boolean) => void;
  service: IService | null;
}

const EditServiceModal: React.FC<Props> = ({
  openEditService,
  setOpenEditService,
  service,
}) => {
  const [loading, setLoading] = React.useState(false);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [form] = Form.useForm();
  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        serviceName: service.serviceName,
        description: service.description,
        price: service.price,
        unit: service.unit,
        type: service.type,
      });
    }
  }, [service, form, openEditService]);

  const handleOk = async () => {
    setLoading(true);
    const values = await form.validateFields();
    const response = await serviceApi.patchServiceApi(
      service?._id || "",
      values.serviceName,
      values.description,
      values.price,
      values.unit,
      values.type
    );
    if (response.statusCode === 200) {
      message.success("Service updated successfully");

      form.resetFields(); // Reset form fields
      setOpenEditService(false); // Close modal on success
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
      centered
      open={openEditService}
      closable={false}
      onCancel={() => {
        setOpenEditService(false);
        form.resetFields();
      }}
      footer={null}
      width={700}
    >
      <div className={`p-4 ${bgColor} ${textColor}`}>
        <h1 className={`text-3xl font-bold text-center${bgColor} ${textColor}`}>
          Edit Service
        </h1>
        <Form form={form} layout="vertical">
          <Form.Item
            name="serviceName"
            label={<span className={` ${textColor} `}>Service Name</span>}
            rules={[
              { required: true, message: "Please input the service name!" },
            ]}
          >
            <Input placeholder="Enter Service Name" />
          </Form.Item>
          <Form.Item
            name="description"
            label={<span className={` ${textColor} `}>Description</span>}
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input placeholder="Enter Description" />
          </Form.Item>
          <Form.Item
            name="price"
            label={<span className={` ${textColor} `}>Price</span>}
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" placeholder="Enter Price" />
          </Form.Item>
          <Form.Item
            name="unit"
            label={<span className={` ${textColor} `}>Unit</span>}
            rules={[{ required: true, message: "Please input the unit!" }]}
          >
            <Select>
              {Object.values(UnitService).map((unit) => (
                <Select.Option key={unit} value={unit}>
                  {unit}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label={<span className={` ${textColor} `}>Type</span>}
            rules={[
              { required: true, message: "Please select the service type!" },
            ]}
          >
            <Select placeholder="Select Type">
              {Object.values(ServiceType).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <div className="mt-4 flex-1 justify-end text-end">
          <Button
            key="back"
            onClick={() => {
              setOpenEditService(false);
              form.resetFields();
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
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditServiceModal;
