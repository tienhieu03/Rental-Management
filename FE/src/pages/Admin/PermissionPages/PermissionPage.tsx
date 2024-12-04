import React, { useEffect } from "react";
import IPermission from "../../../interfaces/IPermisson";
import { permissionApi } from "../../../api";
import { message, notification } from "antd";
import { useTheme } from "../../../contexts/ThemeContext";
import PermissionFilter from "./PermissionFilter";
import { AddButton } from "../../../components";
import ExportToExcel from "./ExportToExcel";
import DetailPermission from "./DetailPermission";
import PermissionTable from "./PermissionTable";
import AddPermissionModal from "./AddPermissionModal";
import EditPermissionModal from "./EditPermissionModal";

function PermissionPage() {
  const [permission, setPermission] = React.useState<IPermission[]>([]);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [openAddPermission, setOpenAddPermission] = React.useState(false);
  const [openEditPermission, setOpenEditPermission] = React.useState(false);
  const [openDetailPermission, setOpenDetailPermission] = React.useState(false);

  const [record, setRecord] = React.useState<any>(null);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [searchParams, setSearchParams] = React.useState({
    name: "",
    method: "",
    module: "",
    apiPath: "",
  });
  const [sorted, setSorted] = React.useState<string>("");
  const getPermission = async () => {
    const queryParams: Record<string, any> = {
      current: currentPage,
      pageSize: pageSize,
      sort: sorted,
    };
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        queryParams[key] = `/${value}/i`;
      }
    });
    const query = new URLSearchParams(queryParams).toString();
    setLoading(true);
    const res = await permissionApi.fetchPermissionApi(query);
    if (res.data) {
      setPermission(res.data.result);
      setTotal(res.data.meta.total);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    getPermission();
  }, [
    currentPage,
    pageSize,
    searchParams,
    sorted,
    openAddPermission,
    openEditPermission,
    openDetailPermission,
  ]);
  const onChange = (pagination: any) => {
    if (pagination.current !== currentPage) setCurrentPage(pagination.current);
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrentPage;
    }
  };
  const handleSearchChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };
  const handleSortChange = (e: any) => {
    setSorted(e.target.value);
    setCurrentPage(1);
  };
  const onDeleted = async (record: any) => {
    const res = await permissionApi.deletePermissionApi(record._id);
    if (res.statusCode === 200) {
      message.success("Delete permission successfully");
      setCurrentPage(1);
      getPermission();
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold m-2">Permission</h1>
      <div className="justify-end flex-1">
        <PermissionFilter
          searchParams={searchParams}
          handleSearchChange={handleSearchChange}
          handleSortChange={handleSortChange}
          sorted={sorted}
        />
        <div
          className={` p-2  rounded-lg shadow-lg  mx-2 justify-between flex items-center
    ${bgColor} ${textColor}
        `}
        >
          <div></div>

          <div className="flex items-center">
            <ExportToExcel permissions={permission} />
            <AddButton
              onClick={() => setOpenAddPermission(true)}
              label="Add Permission"
            />
          </div>
        </div>
        <DetailPermission
          open={openDetailPermission}
          setOpen={setOpenDetailPermission}
          record={record}
        />
        <PermissionTable
          permissions={permission}
          total={total}
          current={currentPage}
          pageSize={pageSize}
          onChange={onChange}
          onDeletePermission={onDeleted}
          isLoading={loading}
          setOpenEditPermission={setOpenEditPermission}
          setOpenDetailPermission={setOpenDetailPermission}
          setRecord={setRecord}
        />
        <AddPermissionModal
          openAddPermission={openAddPermission}
          setOpenAddPermission={setOpenAddPermission}
        />
        <EditPermissionModal
          openEditPermission={openEditPermission}
          setOpenEditPermission={setOpenEditPermission}
          record={record}
        />
      </div>
    </>
  );
}

export default PermissionPage;
