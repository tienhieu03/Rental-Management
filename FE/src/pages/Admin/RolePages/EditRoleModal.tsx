import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  message,
  Collapse,
  Tag,
  Switch,
  notification,
} from "antd";
import { getMethodColor } from "../../../utils/getMethodColor";
import { IPermisson, IRole } from "../../../interfaces";
import { permissionApi, roleApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  openEditRole: boolean;
  setOpenEditRole: (value: boolean) => void;
  record: IRole;
}

const EditRoleModal: React.FC<Props> = ({
  openEditRole,
  setOpenEditRole,
  record,
}) => {
  const { theme } = useTheme();

  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState<IPermisson[]>([]);
  const [enablePermission, setEnablePermission] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (openEditRole && record) {
      form.setFieldsValue({
        Name: record.name,
        Description: record.description,
        Permissions: record.permissions,
      });
    }
  }, [openEditRole, record, form]);
  useEffect(() => {
    const getPermissions = async () => {
      setEnablePermission(record?.permissions);
      const response = await permissionApi.fetchPermissionApi(
        "pageSize=1000&current=1"
      );
      if (response.data) {
        setPermissions(response.data.result);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    };
    getPermissions();
  }, [record]);
  const handleOk = async () => {
    const values = await form.validateFields();
    setIsLoading(true);
    if (enablePermission.length === 0) {
      notification.error({
        message: "Please select at least one permission",
      });

      setIsLoading(false);
      return;
    }
    const response = await roleApi.patchRoleApi(
      record._id,
      values.Name.toUpperCase(),
      values.Description,
      enablePermission
    );
    if (response.statusCode === 200) {
      message.success("Role updated successfully");
      form.resetFields();
      setOpenEditRole(false);
    } else {
      notification.error({
        message: "Error",
        description: response.message,
      });
    }
    setIsLoading(false);
  };

  const groupedPermissions = permissions.reduce(
    // Group permissions by module
    (groups: any, permission: IPermisson) => {
      const { module } = permission; //
      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(permission);
      return groups;
    },
    {}
  );
  const handleSwitchChange = (permissionId: string, check: boolean) => {
    if (check) {
      setEnablePermission([...enablePermission, permissionId]);
    } else {
      setEnablePermission(enablePermission.filter((id) => id !== permissionId));
    }
  };
  const handleModuleToggle = (module: string, checked: boolean) => {
    const modulePermissionIds = groupedPermissions[module].map(
      (permission: IPermisson) => permission._id
    );

    setEnablePermission((prevPermissions) => {
      const filteredPermissions = prevPermissions.filter(
        (id) => !modulePermissionIds.includes(id)
      );

      return checked
        ? [...filteredPermissions, ...modulePermissionIds]
        : filteredPermissions;
    });
  };
  return (
    <Modal
      width={800}
      open={openEditRole}
      closable={false}
      onOk={handleOk}
      onCancel={() => {
        setEnablePermission([]);
        setOpenEditRole(false);
        form.resetFields();
      }}
      footer={null}
    >
      <div className={`${bgColor} ${textColor} p-10`}>
        <h1
          className={`text-3xl font-bold text-center
    ${bgColor} ${textColor}
        `}
        >
          Add Role
        </h1>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<span className={`${textColor}`}>Name</span>}
            name="Name"
            rules={[{ required: true, message: "Please input the role name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<span className={`${textColor}`}>Description</span>}
            name="Description"
            rules={[
              { required: true, message: "Please input the role description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <div className="my-2" />
          <Collapse>
            <Collapse.Panel
              header={
                <div className="flex items-center justify-between">
                  <span className={`${textColor}`}>Permissions</span>
                  <Switch
                    size="small"
                    // Check if ALL permissions are enabled
                    checked={enablePermission?.length === permissions?.length}
                    onChange={(checked, e) => {
                      e.stopPropagation();
                      setEnablePermission(
                        checked ? permissions?.map((p) => p._id) : []
                      );
                    }}
                  />
                </div>
              }
              key="1"
            >
              {Object.keys(groupedPermissions).map((module) => (
                <Collapse key={module} style={{ marginBottom: "16px" }}>
                  <Collapse.Panel
                    header={
                      <div className="flex items-center justify-between">
                        <span className={`${textColor}`}>{module}</span>
                        <Switch
                          size="small"
                          // Check if ALL permissions in module are enabled
                          checked={groupedPermissions[module].every(
                            (permission: IPermisson) =>
                              enablePermission?.includes(permission._id)
                          )}
                          onChange={(checked, e) => {
                            e.stopPropagation();

                            handleModuleToggle(module, checked);
                          }}
                        />
                      </div>
                    }
                    key={module}
                    className={`${bgColor} ${textColor} round-xl`}
                  >
                    <div>
                      {groupedPermissions[module].map(
                        (permission: IPermisson) => (
                          <div
                            key={permission._id}
                            className={`flex items-center p-2 border border-gray-200 rounded-md 
                            ${textColor} ${bgColor}
                              `}
                          >
                            <Tag
                              color={getMethodColor(permission.method)}
                              className="mr-[10px] w-[60px] text-center"
                            >
                              {permission.method}
                            </Tag>
                            <div className="">
                              <span className="font-bold">
                                Name: {permission.name}
                              </span>
                              <p className="flex-1">
                                Api Path: {permission.apiPath}
                              </p>
                            </div>
                            <Switch
                              checked={enablePermission?.includes(
                                permission._id
                              )}
                              onChange={(checked: boolean) =>
                                handleSwitchChange(permission._id, checked)
                              }
                              className="ml-auto"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              ))}
            </Collapse.Panel>
          </Collapse>
        </Form>
        <div className="mt-4 flex-1 justify-end text-end gap-2">
          <Button
            key="back"
            onClick={() => {
              setOpenEditRole(false);
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
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default EditRoleModal;
