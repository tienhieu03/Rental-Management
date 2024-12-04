import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  message,
  Select,
  Collapse,
  Switch,
  notification,
} from "antd";
import { IRoom, IService } from "../../../interfaces";
import { roomApi, serviceApi } from "../../../api";
import { RoomStatus, RoomType } from "../../../enums";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  openEditRoom: boolean;
  setOpenEditRoom: (value: boolean) => void;
  record: IRoom;
}
const EditRoomModal: React.FC<Props> = ({
  openEditRoom,
  setOpenEditRoom,
  record,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [form] = Form.useForm();
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enableService, setEnableService] = useState<string[]>([]);
  useEffect(() => {
    const getService = async () => {
      setIsLoading(true);

      const response = await serviceApi.fetchServiceApi(
        "pageSize=1000&currentPage=1"
      );
      if (response.data) {
        setServices(response.data.result);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
      setIsLoading(false);
    };
    getService();
  }, [record]);
  useEffect(() => {
    if (openEditRoom && record) {
      form.setFieldsValue({
        roomName: record.roomName,
        type: record.type,
        price: record.price,
        status: record.status,
        description: record.description,
        area: record.area,
      });
      setEnableService(record?.services);
    }
  }, [openEditRoom, record, form]);
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (enableService.length === 0) {
        notification.error({
          message: "Please select at least one service",
        });

        return;
      }
      setIsLoading(true);
      const response = await roomApi.patchRoomApi(
        record._id,
        values.area,
        values.type,
        (status = record.status),
        values.price,
        values.description,
        enableService
      );
      if (response.statusCode === 200) {
        message.success("Room updated successfully");
        form.resetFields();
        setOpenEditRoom(false);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
    setIsLoading(false);
  };
  const handleSwitchChange = (checked: boolean, id: string) => {
    if (checked) {
      setEnableService((prev) => [...prev, id]);
    } else {
      setEnableService((prev) => prev.filter((item) => item !== id));
    }
  };
  return (
    <Modal
      closable={false}
      centered
      open={openEditRoom}
      title={<h1 className="text-3xl font-bold text-center">Edit Room</h1>}
      onCancel={() => {
        setOpenEditRoom(false);
        form.resetFields(); // Reset form fields
      }}
      footer={null}
    >
      <div className={`p-4 ${bgColor} ${textColor}`}>
        <h1 className={`text-3xl font-bold text-center${bgColor} ${textColor}`}>
          Edit Room
        </h1>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
        >
          <Form.Item
            label={<span className={` ${textColor} `}>Room Name</span>}
            name="roomName"
            rules={[{ required: true, message: "Please input room name!" }]}
          >
            <Input placeholder="Enter RoomName" disabled />
          </Form.Item>
          <Form.Item
            label={
              <span className={` ${textColor} `}>
                Area (m<sup>2</sup>)
              </span>
            }
            name="area"
            rules={[{ required: true, message: "Please input area!" }]}
          >
            <Input type="number" placeholder="Enter area" />
          </Form.Item>
          <Form.Item
            label={<span className={` ${textColor} `}>Room Type</span>}
            name="type"
            rules={[{ required: true, message: "Please select room type!" }]}
          >
            <Select>
              <Select.Option value={RoomType.Single}>
                {RoomType.Single}
              </Select.Option>
              <Select.Option value={RoomType.Double}>
                {RoomType.Double}
              </Select.Option>
              <Select.Option value={RoomType.Quad}>
                {RoomType.Quad}
              </Select.Option>
              <Select.Option value={RoomType.Studio}>
                {RoomType.Studio}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className={` ${textColor} `}>Status</span>}
            name="status"
            rules={[{ required: true, message: "Please select room status!" }]}
          >
            <Select disabled>
              <Select.Option value={RoomStatus.Available}>
                {RoomStatus.Available}
              </Select.Option>
              <Select.Option value={RoomStatus.Occupied}>
                {RoomStatus.Occupied}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className={` ${textColor} `}>Price (VND)</span>}
            name="price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
          <Form.Item
            label={<span className={` ${textColor} `}>Description</span>}
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>
        </Form>
        <Collapse>
          <Collapse.Panel
            header={
              <div className="flex items-center justify-between">
                <span className={`${textColor}`}>Services</span>
                <Switch
                  // Check if ALL permissions are enabled
                  checked={enableService?.length === services?.length}
                  onChange={(checked, e) => {
                    e.stopPropagation();
                    setEnableService(
                      checked ? services?.map((s) => s._id) : []
                    );
                  }}
                />
              </div>
            }
            key="1"
          >
            {services.map((service) => (
              <div
                key={service._id}
                className={`flex items-center p-2 border border-gray-200 rounded-md 
              ${textColor} ${bgColor}
                `}
              >
                <p>{service.serviceName}</p>
                <Switch
                  checked={enableService?.includes(service._id)}
                  onChange={(checked: boolean) =>
                    handleSwitchChange(checked, service._id)
                  }
                  className="ml-auto"
                />
              </div>
            ))}
          </Collapse.Panel>
        </Collapse>
        <div className="mt-4 flex-1 justify-end text-end">
          <Button
            key="back"
            onClick={() => {
              setOpenEditRoom(false);
              form.resetFields(); // Reset form fields
            }}
          >
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={isLoading}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditRoomModal;
