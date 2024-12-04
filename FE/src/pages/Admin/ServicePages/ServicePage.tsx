import { message, notification } from "antd";
import { useEffect, useState } from "react";
import { AddButton } from "../../../components";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import DetailService from "./DetailService";
import ServiceFilters from "./ServiceFilters";
import ServiceTable from "./ServiceTable";
import ExportToExcel from "./ExportToExcel";
import { IService } from "../../../interfaces";
import { serviceApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";
function ServicePage() {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [services, setServices] = useState<IService[]>([]);

  const [openAddService, setOpenAddService] = useState(false);
  const [openEditService, setOpenEditService] = useState(false);
  const [openDetailService, setOpenDetailService] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [record, setRecord] = useState<any>(null); // New state for the record to delete
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [sorted, setSorted] = useState<string>("");
  const [searchParams, setSearchParams] = useState({
    serviceName: "",
    price: null,
    unit: "",
  });
  const getService = async () => {
    const queryParams: Record<string, any> = {
      currentPage: current,
      pageSize: pageSize,
      sort: sorted,
    };

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        queryParams[key] = `/${value}/i`;
      }
    });
    const query = new URLSearchParams(queryParams).toString();

    setIsLoading(true);
    const res = await serviceApi.fetchServiceApi(query);
    setIsLoading(false);
    if (res.data.result && res) {
      setServices(res.data.result);

      setTotal(res.data.meta.totalDocument); // Ensure total is set correctly
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  // Fetch services function
  useEffect(() => {
    getService();
  }, [
    current,
    pageSize,
    sorted,
    searchParams,
    openAddService,

    openEditService,
  ]);

  const onChange = (pagination: any) => {
    if (pagination.current !== current && pagination) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize !== pageSize && pagination) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleSortChange = (e: any) => {
    setSorted(e.target.value);
    setCurrent(1);
  };

  const onDeleteService = async (record: any) => {
    const res = await serviceApi.deleteServiceApi(record._id);
    if (res.statusCode === 200) {
      message.success("Service deleted");
      getService();
      setCurrent(1);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold m-2">Service</h1>
      <div className="justify-end  w-full">
        <ServiceFilters
          searchParams={searchParams}
          handleSearchChange={handleSearchChange}
          handleSortChange={handleSortChange}
          sorted={sorted}
        />
        <div
          className={` mx-2  rounded-lg shadow-lg  mt-2  justify-between flex items-center
          ${bgColor} ${textColor}
          `}
        >
          <div></div>
          <div className="flex items-center">
            <ExportToExcel services={services} />
            <AddButton
              onClick={() => setOpenAddService(true)}
              label="Add Service"
            />
          </div>
        </div>
        <ServiceTable
          services={services}
          onDeleteService={onDeleteService}
          setOpenDetailService={setOpenDetailService}
          setOpenEditService={setOpenEditService}
          setRecord={setRecord}
          isLoading={isLoading}
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={onChange}
        />
      </div>

      <AddServiceModal
        openAddService={openAddService}
        setOpenAddService={setOpenAddService}
      />
      <EditServiceModal
        openEditService={openEditService}
        setOpenEditService={setOpenEditService}
        service={record}
      />
      <DetailService
        openDetailService={openDetailService}
        setOpenDetailService={setOpenDetailService}
        record={record}
      />
    </>
  );
}

export default ServicePage;
