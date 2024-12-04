import React from "react";
import { SearchFilters, SortOption } from "../../../components";
import { ApiMethod } from "../../../enums";
interface Props {
  searchParams: any;
  handleSearchChange: (field: string, value: string) => void;
  handleSortChange: (e: any) => void;
  sorted: string;
}

const PermissionFilter: React.FC<Props> = ({
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
        fields={[
          { label: "Permission Name", field: "name", type: "text" },
          {
            label: "Method",
            field: "method",
            type: "select",
            options: [
              { label: "All Method", value: "" },
              ...Object.values(ApiMethod).map((method) => ({
                value: method.toString(),
                label: method.toString(),
              })),
            ],
          },
          { label: "Module", field: "module", type: "text" },
        ]}
      />

      <SortOption
        options={[
          { value: "name", label: "By Permission Name" },
          { value: "-createdAt", label: "By Created At" },
          { value: "method", label: "By Method" },
          { value: "module", label: "By Module" },
          { value: "apiPath", label: "By Path" },
        ]}
        sorted={sorted}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default PermissionFilter;
