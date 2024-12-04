import React, { useEffect, useState } from "react";
import {
  Descriptions,
  Drawer,
  Switch,
  Tag,
  Collapse,
  notification,
} from "antd";
import moment from "moment";

import { getMethodColor } from "../../../utils/getMethodColor";
import { IPermisson } from "../../../interfaces";
import { permissionApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  openDetailRole: boolean;
  setOpenDetailRole: (value: boolean) => void;
  record: any;
}

const DetailRole: React.FC<Props> = ({
  openDetailRole,
  setOpenDetailRole,
  record,
}) => {
  const { theme } = useTheme();

  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  const [permissions, setPermissions] = useState<IPermisson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [enablePermission, setEnablePermission] = useState<string[]>(() => {
    return record?.permissions || [];
  });

  useEffect(() => {
    const getPermissions = async () => {
      setIsLoading(true);
      const response = await permissionApi.fetchPermissionApi(
        "pageSize=1000&current=1"
      );
      if (response.data) {
        setPermissions(response.data.result);
        
        setEnablePermission(
          response.data.result.map((permission: IPermisson) => permission._id)
        );
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }

      setIsLoading(false);
    };
    getPermissions();
  }, [record]);

  const groupedPermissions = permissions.reduce(
    (groups: any, permission: IPermisson) => {
      const { module } = permission;
      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(permission);
      return groups;
    },
    {}
  );
  const handleSwitchChange = (permissionId: string, checked: boolean) => {
    setEnablePermission((prevPermissions) =>
      checked
        ? [...prevPermissions, permissionId]
        : prevPermissions.filter((id) => id !== permissionId)
    );
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
  const renderItem = (label: string, value: React.ReactNode) => ({
    key: label,
    label: <span className={textColor}>{label}</span>,
    children: <span className={textColor}>{value}</span>,
  });

  const items = [
    renderItem("Role Name", record?.name),
    renderItem("Description", record?.description),
    renderItem(
      "Created At",
      <span className={textColor}>{formatDate(record?.createdAt)}</span>
    ),
    renderItem(
      "Created By",
      <span className={textColor}>{record?.createdBy?.email}</span>
    ),
    renderItem(
      "Updated At",
      <span className={textColor}>{formatDate(record?.updatedAt)}</span>
    ),
    renderItem(
      "Updated By",
      <span className={textColor}>{record?.updatedBy?.email}</span>
    ),
  ];

  return (
    <div className={`flex-1 ${textColor} ${bgColor}`}>
      <Drawer
        bodyStyle={{ padding: 0, margin: 0 }} // Xóa khoảng trắng mặc định
        closable={false}
        className={`${textColor} ${bgColor}`}
        loading={isLoading}
        open={openDetailRole}
        onClose={() => setOpenDetailRole(false)}
        width={"100vh"}
      >
        <div
          className={`${textColor} ${bgColor} flex-1 items-center justify-center p-2`}
        >
          <h1 className="text-4xl my-2 mb-6 font-bold">Role Detail</h1>
          <Descriptions bordered items={items} column={1} />
          <div className="my-2" />
          <Collapse>
            <Collapse.Panel
              header={
                <div className="flex items-center justify-between">
                  <span className={`${textColor}`}>Permissions</span>
                  <Switch
                    disabled
                    size="small"
                    // Check if ALL permissions are enabled
                    checked={enablePermission?.length === permissions?.length}
                    onChange={(checked, e) => {
                      e.stopPropagation();
                      setEnablePermission(
                        checked ? permissions.map((p) => p._id) : []
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
                          disabled
                          size="small"
                          // Check if ALL permissions in module are enabled
                          checked={groupedPermissions[module].every(
                            (permission: IPermisson) =>
                              enablePermission?.includes(permission._id)
                          )}
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
                            className={`flex items-center p-1 border border-gray-200 rounded-md
                              ${textColor} ${bgColor} `}
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
        </div>
      </Drawer>
    </div>
  );
};

export default DetailRole;