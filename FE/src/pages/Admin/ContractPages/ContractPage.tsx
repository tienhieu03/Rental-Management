import { message, notification } from "antd";
import { useEffect, useState } from "react";
import { AddButton } from "../../../components"; // Change to CustomModal
import AddContractModal from "./AddContractModal";
import DetailContract from "./DetailContract";
import ContractFilters from "./ContractFilter";
import ExportToExcel from "./ExportToExcel";
import ContractCards from "./ContractCard";
import { IContract } from "../../../interfaces";
import { ContractStatus, RoomStatus } from "../../../enums";
import { contractApi, roomApi } from "../../../api";
import { useTheme } from "../../../contexts/ThemeContext";

function ContractPage() {
  const [contracts, setContracts] = useState<IContract[]>([]);

  const [openAddContract, setOpenAddContract] = useState(false);

  const [openDetailContract, setOpenDetailContract] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [sorted, setSorted] = useState<string>("");
  const [searchParams, setSearchParams] = useState({
    "room.roomName": "",
    "tenant.name": "",
    status: "",
    phone: "",
  });
  const handleCancelContract = async (id: string, roomId: string) => {
    const res = await contractApi.patchContractApi(id, ContractStatus.CANCELED);
    if (res.data) {
      const response = await roomApi.updateRoomStatusApi(
        roomId,
        RoomStatus.Available
      );

      if (response.data) {
        message.success("Cancel contract successfully");
        getContracts();
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  const onDelete = async (record: any) => {
    const res = await contractApi.deleteContractApi(record._id);
    if (res.data) {
      message.success("Delete contract successfully");
      getContracts();
      setCurrent(1);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };

  const getContracts = async () => {
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
    const res = await contractApi.fetchContractApi(query);
    if (res.data) {
      setContracts(res.data.result);
      setTotal(res.data.meta.totalDocument);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getContracts();
  }, [current, pageSize, sorted, searchParams, openAddContract]);
  const handlePaginationChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    if (pageSize) setPageSize(pageSize);
  };
  const handleSearchChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleSortChange = (e: any) => {
    setSorted(e.target.value);
    setCurrent(1);
  };
  return (
    <>
      <h1 className="font-bold text-2xl m-2">Contract</h1>
      <div className="justify-end p-2 flex-1">
        <ContractFilters
          searchParams={searchParams}
          handleSearchChange={handleSearchChange}
          handleSortChange={handleSortChange}
          sorted={sorted}
        />
        <div
          className={` p-2 rounded-lg shadow-lg mx-2 mt-2 justify-between flex items-center
     ${bgColor} ${textColor}
          `}
        >
          <div />

          <div className="flex items-center">
            <ExportToExcel contracts={contracts} />
            <AddButton
              onClick={() => setOpenAddContract(true)}
              label="Add Contract"
            />
          </div>
        </div>
        <ContractCards
          contracts={contracts}
          handleCancelContract={handleCancelContract}
          setOpenDetailContract={setOpenDetailContract}
          setRecord={setRecord}
          isLoading={isLoading}
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={handlePaginationChange}
          onDelete={onDelete}
        />
      </div>

      <DetailContract
        openDetailContract={openDetailContract}
        setOpenDetailContract={setOpenDetailContract}
        record={record}
      />
      <AddContractModal
        openAddContract={openAddContract}
        setOpenAddContract={setOpenAddContract}
      />
    </>
  );
}

export default ContractPage;
