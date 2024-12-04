import React from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  Select,
  message,
  notification,
} from "antd";
import { serviceApi } from "../../../api";
import { ServiceType, UnitService } from "../../../enums";
import { useTheme } from "../../../contexts/ThemeContext";
interface Props {
  openAddService: boolean;
  setOpenAddService: (value: boolean) => void;
}

const AddServiceModal: React.FC<Props> = ({
  openAddService,
  setOpenAddService,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const handleOk = async () => {
    setLoading(true);
    // Validate the form fields
    const values = await form.validateFields();
    const response = await serviceApi.postServiceApi(
      values.serviceName,
      values.description,
      values.price,
      values.unit,
      values.type
    );
    if (response.statusCode === 201) {
      message.success("Service added successfully");
      form.resetFields(); // Reset form fields
      //   dispatch(addServiceAction(values))

      setOpenAddService(false); // Close modal on success
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
      open={openAddService}
      onCancel={() => {
        setOpenAddService(false);
        form.resetFields(); // Reset form fields
      }}
      footer={null}
      width={700}
    >
      <div className={`p-4 ${bgColor} ${textColor}`}>
        <h1 className={`text-3xl font-bold text-center${bgColor} ${textColor}`}>
          Add Service
        </h1>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<span className={` ${textColor} `}>Service Name</span>}
            name="serviceName"
            rules={[{ required: true, message: "serviceName is required" }]}
          >
            <Input placeholder="Enter serviceName" />
          </Form.Item>

          <Form.Item
            label={<span className={` ${textColor} `}>Description</span>}
            name="description"
            rules={[{ required: true, message: "description is required" }]}
          >
            <Input.TextArea placeholder="Enter  description" />
          </Form.Item>

          <Form.Item
            label={<span className={` ${textColor} `}>Price</span>}
            name="price"
            rules={[{ required: true, message: "price is required" }]}
          >
            <Input type="number" placeholder="Enter  price" />
          </Form.Item>

          <Form.Item
            label={<span className={` ${textColor} `}>Unit</span>}
            name="unit"
            rules={[{ required: true, message: "unit is required" }]}
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
            label={<span className={` ${textColor} `}>Type</span>}
            name="type"
            rules={[{ required: true, message: "type is required" }]}
          >
            <Select>
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
              setOpenAddService(false);
              form.resetFields(); // Reset form fields
            }}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button key="submit" type="primary" onClick={handleOk}
          loading={loading}
          >
            <p className="font-xl text-white flex">Add</p>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddServiceModal;
