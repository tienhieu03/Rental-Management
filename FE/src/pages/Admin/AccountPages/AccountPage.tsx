import { message, notification } from "antd";
import { useEffect, useState } from "react";
import { AddButton } from "../../../components"; // Change to CustomModal
import { accountApi, roleApi } from "../../../api/";
import AddAccountModal from "./AddAccountModal";
import { IAccount } from "../../../interfaces";
import EditAccountModal from "./EditAccountModal";
import DetailAccount from "./DetailAccount";
import AccountFilters from "./AccountFilter";
import ExportToExcel from "./ExportToExcel";
import AccountCard from "./AccountCard";
import { useTheme } from "../../../contexts/ThemeContext";
function AccountPage() {
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [roles, setRoles] = useState<any[]>([]);
  const [openAddAccount, setOpenAddAccount] = useState(false);
  const [openEditAccount, setOpenEditAccount] = useState(false);
  const [openDetailAccount, setOpenDetailAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [record, setRecord] = useState<any>(null); // New state for the record to delete
  const [sorted, setSorted] = useState<string>("");
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const bgColor = isLightTheme ? "bg-white" : "bg-gray-800";
  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  const getRole = async () => {
    const res = await roleApi.fecthRoleApi("current=1&pageSize=99900");
    if (res.data.result) {
      setRoles(res.data.result);
    }
  };
  // Fetch accounts function
  const getAccount = async () => {
    const queryParams: Record<string, any> = {
      current: current,
      pageSize: pageSize,
      populate: "role",
      fields: "role.name",
      sort: sorted,
    };

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        if (key === "role" || key === "isActive") {
          queryParams[key] = value;
        } else queryParams[key] = `/${value}/i`;
      }
    });

    const query = new URLSearchParams(queryParams).toString();
    setIsLoading(true);

    const res = await accountApi.fecthAccountApi(query);

    setIsLoading(false);
    if (res.data.result) {
      const formattedAccounts = res.data.result.map((account: IAccount) => ({
        ...account,
        roleName: account.role?.name || "Unknown Role",
      }));

      setAccounts(formattedAccounts);
      setTotal(res.data.meta.total);
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };
  useEffect(() => {
    getAccount();
    getRole();
  }, [
    current,
    pageSize,
    sorted,
    searchParams,
    openAddAccount,
    openEditAccount,
  ]);

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

  const onDeleteAccount = async (record: any) => {
    const res = await accountApi.deleteAcountApi(record._id);
    if (res.statusCode === 200) {
      message.success("Account deleted");
      getAccount();
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
      <h1 className="font-bold text-2xl m-2">Account</h1>
      <div className="justify-end  w-full rounded-[20px] ">
        <AccountFilters
          searchParams={searchParams}
          handleSearchChange={handleSearchChange}
          handleSortChange={handleSortChange}
          sorted={sorted}
          roles={roles}
        />
        <div
          className={` p-2 mx-2 rounded-lg mb-2 shadow-lg  justify-between items-center flex
        ${bgColor} ${textColor}
          `}
        >
          <div></div>
          <div className="flex justify-center items-center">
            <ExportToExcel accounts={accounts} />
            <AddButton
              onClick={() => setOpenAddAccount(true)}
              label="Add Account"
            />
          </div>
        </div>
        <AccountCard
          accounts={accounts}
          isLoading={isLoading}
          current={current}
          pageSize={pageSize}
          total={total}
          onChange={handlePaginationChange}
          onDeleteAccount={onDeleteAccount}
          setOpenEditAccount={setOpenEditAccount}
          setOpenDetailAccount={setOpenDetailAccount}
          setRecord={setRecord}
        />
      </div>

      <AddAccountModal
        openAddAccount={openAddAccount}
        setOpenAddAccount={setOpenAddAccount}
      />
      <EditAccountModal
        openEditAccount={openEditAccount}
        setOpenEditAccount={setOpenEditAccount}
        record={record}
        isChangeRole={false}
      />
      <DetailAccount
        openDetailAccount={openDetailAccount}
        setOpenDetailAccount={setOpenDetailAccount}
        record={record}
      />
    </>
  );
}

export default AccountPage;
