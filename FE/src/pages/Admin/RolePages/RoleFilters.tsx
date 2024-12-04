import React from "react";
import { SearchFilters, SortOption } from "../../../components";
interface Props {
  searchParams: any;
  handleSearchChange: (field: string, value: string) => void;
  handleSortChange: (e: any) => void;
  sorted: string;
}
const RoleFilters: React.FC<Props> = ({
  searchParams,
  handleSearchChange,
  handleSortChange,
  sorted,
}) => {
  return (
    <div className="flex-1 p-2 w-full flex justify-between gap-4">
      <SearchFilters
        searchParams={searchParams}
        onSearchChange={handleSearchChange}
        fields={[{ label: "Role Name", field: "name", type: "text" }]}
      />
      <SortOption
        options={[
          { value: "name", label: "By Role Name" },
          { value: "createdAt", label: "By Created At" },
        ]}
        sorted={sorted}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default RoleFilters;
