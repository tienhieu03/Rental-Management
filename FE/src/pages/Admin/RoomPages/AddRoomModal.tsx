import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  message,
  Collapse,
  Switch,
  Form,
  notification,
} from "antd";
import { IService } from "../../../interfaces";
import { roomApi, serviceApi } from "../../../api";
import { RoomStatus, RoomType } from "../../../enums";
import { useTheme } from "../../../contexts/ThemeContext";
interface Props {
  openAddRoom: boolean;
  setOpenAddRoom: (value: boolean) => void;
}

const AddRoomModal: React.FC<Props> = ({ openAddRoom, setOpenAddRoom }) => {
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
  }, []);

  const handleOk = async () => {
    const values = await form.validateFields();
    if (enableService.length === 0) {
      notification.error({
        message: "Please select at least one service",
      });
      return;
    }

    setIsLoading(true);
    const response = await roomApi.postRoomApi(
      values.roomName,
      values.Area,
      values.type,
      RoomStatus.Available,
      values.price,
      values.description,
      enableService
    );

    if (response.statusCode === 201) {
      message.success("Room created successfully");
      form.resetFields();
      setOpenAddRoom(false);
    } else {
      notification.error({
        message: "Error",
        description: response.message,
      });
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
      open={openAddRoom}
      onOk={handleOk}
      onCancel={() => {
        setOpenAddRoom(false);
        form.resetFields();
      }}
      footer={null}
      width={700}
    >
      <div className={`p-4 ${bgColor} ${textColor}`}>
        <h1 className={`text-3xl font-bold text-center${bgColor} ${textColor}`}>
          Add Room
        </h1>
        <Form form={form} layout="vertical">
          <Form.Item
            name="roomName"
            label={<span className={` ${textColor} `}>Room Name</span>}
            rules={[{ required: true, message: "Please input the room name!" }]}
          >
            <Input placeholder="Enter Room Name" />
          </Form.Item>
          <Form.Item
            name="type"
            label={<span className={` ${textColor}`}>Room Type</span>}
            rules={[
              { required: true, message: "Please select the room type!" },
            ]}
          >
            <Select placeholder="Select Room Type">
              {Object.values(RoomType).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Area"
            label={
              <span className={` ${textColor} `}>
                Area (m<sup>2</sup>)
              </span>
            }
            rules={[{ required: true, message: "Please input the area!" }]}
          >
            <Input type="number" placeholder="Enter Area" />
          </Form.Item>
          <Form.Item
            name="price"
            label={<span className={` ${textColor} `}>Price (VND)</span>}
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" placeholder="Enter Price" />
          </Form.Item>
          <Form.Item
            name="description"
            label={<span className={` ${textColor} `}>Description</span>}
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter Description" />
          </Form.Item>
        </Form>
        <div className="my-2" />
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
              setOpenAddRoom(false);
              form.resetFields();
            }}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleOk}
          >
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddRoomModal;
