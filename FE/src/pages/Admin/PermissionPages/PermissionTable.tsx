import React, { useState } from "react";

import {
  ColumnSelector,
  DeleteModal,
  TableComponent,
} from "../../../components";
import { IPermisson } from "../../../interfaces";
import { Button } from "antd";
import { useTheme } from "../../../contexts/ThemeContext";
import { getMethodColor } from "../../../utils/getMethodColor";
import { ApiMethod } from "../../../enums";

interface Props {
  permissions: IPermisson[];
  isLoading: boolean;
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  onDeletePermission: (record: any) => Promise<void>;
  setOpenEditPermission: (value: boolean) => void;
  setOpenDetailPermission: (value: boolean) => void;
  setRecord: (value: any) => void;
}
const PermissionTable: React.FC<Props> = ({
  permissions,
  isLoading,
  current,
  pageSize,
  total,
  onChange,
  onDeletePermission,
  setOpenEditPermission,
  setOpenDetailPermission,
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
      render: (_id: string, record: IPermisson) => (
        <p
          className="text-blue-600 hover:text-blue-300"
          onClick={() => {
            setOpenDetailPermission(true);
            setRecord(record);
          }}
        >
          {_id}
        </p>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method: string) => (
        <span
          className={`text-${getMethodColor(
            method as ApiMethod
          )}-600 font-bold`}
        >
          {method}
        </span>
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "API Path",
      dataIndex: "apiPath",
      key: "apiPath",
      render: (apiPath: string) => (
        // chữ nghiêng
        <i>{apiPath}</i>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <div className="gap-2 flex">
          <Button
            onClick={() => {
              setRecord(record);
              setOpenEditPermission(true);
            }}
            icon={
              <i className="fa-solid fa-pen-to-square text-green-600 text-xl" />
            }
          >
            Edit
          </Button>
          <DeleteModal record={record} onConfirm={onDeletePermission} />
        </div>
      ),
      width: 150,
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
        columns={columns}
        data={permissions}
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

export default PermissionTable;
