import React, { useState } from "react";

import {
  ColumnSelector,
  DeleteModal,
  TableComponent,
} from "../../../components";
import { Button } from "antd";
import { getRoleColor } from "../../../utils/getMethodColor";
import { IRole } from "../../../interfaces";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  roles: IRole[];
  isLoading: boolean;
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  onDeleteRole: (record: IRole) => Promise<void>;
  setOpenEditRole: (value: boolean) => void;
  setOpenDetailRole: (value: boolean) => void;
  setRecord: (value: IRole) => void;
}
const RoleTable: React.FC<Props> = ({
  roles,
  isLoading,
  current,
  pageSize,
  total,
  onChange,
  onDeleteRole,
  setOpenEditRole,
  setOpenDetailRole,
  setRecord,
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_id: string, record: IRole) => (
        <p
          className="text-blue-600 hover:text-blue-300"
          onClick={() => {
            setOpenDetailRole(true);
            setRecord(record);
          }}
        >
          {_id}
        </p>
      ),
    },
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <p className={` ${getRoleColor(name) as string}  font-bold`}>{name}</p>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description" },

    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) =>
        record.name === "SUPER ADMIN" || record.name === "NORMAL " ? null : (
          <div className="gap-2 flex">
            <Button
              icon={
                <i className="fa-solid fa-pen-to-square text-green-600 text-xl" />
              }
              onClick={() => {
                setOpenEditRole(true), setRecord(record);
              }}
            >
              Edit
            </Button>

            <DeleteModal
              onConfirm={onDeleteRole} // Pass the delete function
              record={record} // Pass the record to delete
            />
          </div>
        ),
      with: 150,
    },
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((column) => column.dataIndex)
  );
  return (
    <div
      className={` p-2 rounded-lg m-2
  `}
    >
      <div>
        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          onChangeVisibleColumns={setVisibleColumns}
        />
      </div>
      <TableComponent
        data={roles}
        columns={columns}
        visibleColumns={visibleColumns}
        isLoading={isLoading}
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </div>
  );
};

export default RoleTable;
