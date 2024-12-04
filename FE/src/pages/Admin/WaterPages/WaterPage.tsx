import { useEffect, useState } from "react";
import WaterTable from "./WaterTable";
import ExportToExcel from "./ExportToExcel";
import { IContract, IService } from "../../../interfaces";
import { ContractStatus, ServiceType } from "../../../enums";
import { contractApi, invoiceApi, serviceApi } from "../../../api";
import { YearMonthSelector } from "../../../components";
import { notification } from "antd";
import { useTheme } from "../../../contexts/ThemeContext";
const WaterPage = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    currentMonth
  );
  const [year, setYear] = useState<number | null>(currentYear);
  const [contract, setContract] = useState<IContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [numberIndex, setNumberIndex] = useState<{
    [key: string]: { firstIndex: number; finalIndex: number; invoiceId: "" };
  }>({});
  const [water, setWater] = useState({} as IService);
  const getWaterService = async () => {
    setLoading(true);
    const res = await serviceApi.fetchServiceApi(`type=${ServiceType.Water}`);
    if (res.data) {
      setWater(res.data.result[0]);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  useEffect(() => {
    getWaterService();
  }, []);

  const getContract = async () => {
    setLoading(true);
    try {
      const res = await contractApi.fetchContractApi(
        `currentPage=1&pageSize=99999`
      );
      if (res.data) {
        const newContract = res.data.result.filter((contract: IContract) => {
          const startDate = new Date(contract.startDate);
          const endDate = new Date(contract.endDate);
          const monthStart = new Date(
            year ?? currentYear,
            (selectedMonth ?? currentMonth) - 1,
            1
          );
          const monthEnd = new Date(
            year ?? currentYear,
            selectedMonth ?? currentMonth,
            0
          );
          const actualEndDate = new Date(contract.actualEndDate);
          if (contract.status === ContractStatus.ACTIVE) {
            return startDate <= monthEnd && endDate >= monthStart;
          }
          if (contract.status === ContractStatus.CANCELED) {
            return startDate <= monthEnd && actualEndDate >= monthStart;
          }
          if (contract.status === ContractStatus.EXPIRED) {
            return startDate <= monthEnd && endDate >= monthStart;
          }
        });
        setContract(newContract);

        const initialIndices = await Promise.all(
          newContract.map(async (contract: IContract) => {
            const billResponse = await invoiceApi.fetchInvoiceApi(
              `tenant._id=${contract.tenant._id}&room._id=${contract.room._id}&month=${selectedMonth}-${year}&service._id=${water._id}`
            );
            return {
              [contract._id]: billResponse.data?.result?.[0]
                ? {
                    firstIndex: billResponse.data.result[0].firstIndex,
                    finalIndex: billResponse.data.result[0].finalIndex,
                    invoiceId: billResponse.data.result[0]._id,
                  }
                : { firstIndex: 0, finalIndex: 0, invoiceId: "" },
            };
          })
        );

        setNumberIndex(Object.assign({}, ...initialIndices));
      }
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContract();
  }, [selectedMonth, year, water]);
  const handleInputChange = (
    id: string,
    field: "firstIndex" | "finalIndex",
    value: number
  ) => {
    setNumberIndex((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <>
      {" "}
      <h1 className="text-2xl font-bold m-2"></h1>
      <div className="justify-end  w-full">
        <div
          className={`  m-2  rounded-lg shadow-lg   justify-between flex-1 items-center cursor flex
      ${bgColor} ${textColor}
        `}
        >
          <YearMonthSelector
            selectedMonth={selectedMonth}
            year={year}
            setYear={setYear}
            setSelectedMonth={setSelectedMonth}
          />
          <ExportToExcel
            contract={contract}
            numberIndex={numberIndex}
            water={water}
            selectedMonth={selectedMonth || currentMonth}
            year={year || currentYear}
          />
        </div>
        <WaterTable
          contract={contract}
          numberIndex={numberIndex}
          loading={loading}
          handleInputChange={handleInputChange}
          water={water}
          selectedMonth={selectedMonth || currentMonth}
          year={year || currentYear}
        />
      </div>
    </>
  );
};

export default WaterPage;
