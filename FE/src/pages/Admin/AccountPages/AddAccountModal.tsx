import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  DatePicker,
  Form,
  Select,
  message,
  notification,
} from "antd";
import { Gender } from "../../../enums";
import { IRole } from "../../../interfaces";
import { RenderUploadField } from "../../../components";
import { upfileApi, roleApi, accountApi } from "../../../api";
import {
  checkEmail,
  checkIdCard,
  checkPassword,
  checkPhoneNumberVN,
} from "../../../utils/regex";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  openAddAccount: boolean;
  setOpenAddAccount: (value: boolean) => void;
}

const { Option } = Select;

const AddAccountModal: React.FC<Props> = ({
  openAddAccount,
  setOpenAddAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [role, setRole] = useState<IRole[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [frontIdImage, setFrontIdImage] = useState<File | null>(null);
  const [backIdImage, setBackIdImage] = useState<File | null>(null);
  const [temporaryResidenceImage, setTemporaryResidenceImage] =
    useState<File | null>(null);
  const [imageAvatar] = useState<string>("");
  const [imageFrontId] = useState<string>("");
  const [imageBackId] = useState<string>("");
  const [imageTemporaryResidence] = useState<string>("");

  useEffect(() => {
    const getRole = async () => {
      const res = await roleApi.fecthRoleApi("current=1&pageSize=1000");
      if (res?.data) {
        setRole(res.data.result);
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    };
    getRole();
  }, [openAddAccount]);

  const [form] = Form.useForm();

  const handleOk = async () => {
    // Validate the form fields
    const values = await form.validateFields();

    // Combine first name, middle name, and last name into a single name
    const fullName = `${values.FirstName} ${values.MiddleName || ""} ${
      values.LastName
    }`.trim();

    const birthdayDate = values.BirthDay.toDate();
    const birthdayIsoString = new Date(birthdayDate).toISOString();
    const birthdayAsDate = new Date(birthdayIsoString);
    let avatarFileName = imageAvatar;
    let frontIdFileName = imageFrontId;
    let backIdFileName = imageBackId;
    let temporaryResidenceFileName = imageTemporaryResidence;
    // Upload images if they exist
    // if (!checkEmail(values.email)) {
    //   notification.error({
    //     message: "Error",
    //     description: "Email is not correct",
    //   });

    //   return;
    // }

    // if (!checkPassword(values.password)) {
    //   notification.error({
    //     message: "Error",
    //     description:
    //       "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character",
    //   });

    //   return;
    // }

    // if (!checkIdCard(values.idCard)) {
    //   notification.error({
    //     message: "Error",
    //     description: "IdCard is not correct",
    //   });

    //   return;
    // }
    // if (checkPhoneNumberVN(values.phone)) {
    //   notification.error({
    //     message: "Error",
    //     description: "Phone number is not correct",
    //   });

    //   return;
    // }
    setLoading(true);
    if (avatar) {
      const response = await upfileApi.postAvatarApi(avatar);
      if (response.statusCode === 201) {
        avatarFileName = response.data.fileName;
      } else {
        notification.error({
          message: "Error",
          description: "Failed to upload avatar image.",
        });

        return;
      }
    }
    if (frontIdImage) {
      const response = await upfileApi.postAvatarApi(frontIdImage);
      if (response.statusCode === 201) {
        frontIdFileName = response.data.fileName;
      } else {
        notification.error({
          message: "Error",
          description: "Failed to upload front id image.",
        });

        return;
      }
    }
    if (backIdImage) {
      const response = await upfileApi.postAvatarApi(backIdImage);
      if (response.statusCode === 201) {
        backIdFileName = response.data.fileName;
      } else {
        notification.error({
          message: "Error",
          description: "Failed to upload back id image.",
        });

        return;
      }
    }
    if (temporaryResidenceImage) {
      const response = await upfileApi.postAvatarApi(temporaryResidenceImage);
      if (response.statusCode === 201) {
        temporaryResidenceFileName = response.data.fileName;
      } else {
        notification.error({
          message: "Error",
          description: "Failed to upload temporary residence image.",
        });

        return;
      }
    }

    // Call the API to post account data
    const response = await accountApi.postAccountApi(
      values.Email,
      values.Phone,
      values.Password,
      fullName, // Use the combined full name
      birthdayAsDate,
      values.Gender,
      values.Address,
      values.IdCard,
      values.Role,
      avatarFileName,
      [frontIdFileName, backIdFileName, temporaryResidenceFileName]
    );

    if (response.statusCode === 201) {
      message.success("Account added successfully");
      refesh();
    } else {
      // Display detailed error messages if available

      notification.error({
        message: "Error",
        description: response.message,
      });
    }
    setLoading(false);
  };
  const refesh = () => {
    setOpenAddAccount(false);
    form.resetFields(); // Reset form fields
    setAvatar(null);
    setFrontIdImage(null);
    setBackIdImage(null);
    setTemporaryResidenceImage(null);
    setRole([]);
  };
  return (
    <Modal
      bodyStyle={{ padding: 0, margin: 0 }} // Xóa khoảng trắng mặc định
      closable={false}
      centered
      open={openAddAccount}
      onCancel={refesh}
      footer={null}
      width={700}
    >
      <div className={`p-4 ${bgColor} ${textColor}`}>
        <h1 className={`text-3xl font-bold text-center${bgColor} ${textColor}`}>
          Add Account
        </h1>
        <Form form={form} layout="vertical">
          <RenderUploadField
            type="avatar"
            selectedImage={avatar}
            setSelectedImage={setAvatar}
            imageUrl={imageAvatar}
          />

          <Form.Item
            label={<span className={`${bgColor} ${textColor}`}>Name</span>}
            wrapperCol={{ span: 24 }}
          >
            <div className="lg:flex justify-between">
              <Form.Item
                name="FirstName"
                rules={[{ required: true, message: "First name is required" }]}
                className="m-1 flex-1"
              >
                <Input placeholder="First Name" size="large" />
              </Form.Item>
              <Form.Item name="MiddleName" className="m-1 flex-1">
                <Input placeholder="Middle Name" size="large" />
              </Form.Item>
              <Form.Item
                name="LastName"
                rules={[{ required: true, message: "Last name is required" }]}
                className="m-1 flex-1"
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <div className="lg:flex justify-between">
              <Form.Item
                className="m-1 flex-1"
                label={
                  <span className={`  ${bgColor} ${textColor}`}>Email</span>
                }
                name="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  {
                    type: "email",
                    message: "Email must be a valid email address",
                  },
                ]}
              >
                <Input placeholder="Enter email" size="large" />
              </Form.Item>
              <Form.Item
                className="m-1 flex-1"
                label={
                  <span className={` ${bgColor} ${textColor}`}>Phone</span>
                }
                name="Phone"
                rules={[{ required: true, message: "Phone is required" }]}
              >
                <Input type="number" placeholder="Enter phone" size="large" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <div className="lg:flex justify-between">
              <Form.Item
                label={
                  <span className={` ${bgColor} ${textColor}`}>Password</span>
                }
                name="Password"
                rules={[{ required: true, message: "Password is required" }]}
                className="m-1 flex-1"
              >
                <Input.Password placeholder="Enter password" size="large" />
              </Form.Item>
              <Form.Item
                label={
                  <span className={` ${bgColor} ${textColor}`}>IdCard</span>
                }
                name="IdCard"
                rules={[{ required: true, message: "IdCard is required" }]}
                className="m-1 flex-1"
              >
                <Input type="number" placeholder="Enter IdCard" size="large" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <div className="lg:flex justify-between">
              <Form.Item
                label={
                  <span className={` ${bgColor} ${textColor}`}>Birthday</span>
                }
                name="BirthDay"
                rules={[{ required: true, message: "Birthday is required" }]}
                className="m-1 flex-1"
              >
                <DatePicker placeholder="Enter Birthday" size="large" />
              </Form.Item>
              <Form.Item
                label={
                  <span className={`${bgColor} ${textColor}`}>Gender</span>
                }
                name="Gender"
                rules={[{ required: true, message: "Gender is required" }]}
                className="m-1 flex-1"
              >
                <Select placeholder="Select gender" size="large">
                  {Object.values(Gender).map((gender) => (
                    <Option key={gender} value={gender}>
                      {gender}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={<span className={` ${bgColor} ${textColor}`}>Role</span>}
                name="Role"
                rules={[{ required: true, message: "Role is required" }]}
                className="m-1 flex-1"
              >
                <Select
                  placeholder="Select role"
                  size="large"
                  dropdownRender={(menu) => (
                    <div className="max-h-[150px] overflow-y-auto">{menu}</div>
                  )}
                >
                  {role.map((r) => (
                    <Option key={r._id} value={r._id}>
                      {r.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            label={<span className={` ${bgColor} ${textColor}`}>Address</span>}
            name="Address"
            rules={[{ required: true, message: "Address is required" }]}
            className="flex-1 m-1"
          >
            <Input placeholder="Enter address" size="large" />
          </Form.Item>
          <div className="lg:flex justify-between">
            <RenderUploadField
              type="frontIdCard"
              selectedImage={frontIdImage}
              setSelectedImage={setFrontIdImage}
            />
            <RenderUploadField
              type="backIdCard"
              selectedImage={backIdImage}
              setSelectedImage={setBackIdImage}
            />
            <RenderUploadField
              type="temporaryResidence"
              selectedImage={temporaryResidenceImage}
              setSelectedImage={setTemporaryResidenceImage}
            />
          </div>
        </Form>
        <div className="mt-4 flex-1 justify-end text-end">
          <Button size="large" key="back" onClick={refesh} className="mr-2">
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            size="large"
            loading={loading}
          >
            <p className="font-xl text-white flex">Add</p>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddAccountModal;
