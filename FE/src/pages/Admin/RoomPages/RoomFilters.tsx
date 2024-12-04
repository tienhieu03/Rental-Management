import React from "react";
import { SearchFilters, SortOption } from "../../../components";
import { RoomStatus, RoomType } from "../../../enums";
interface Props {
  searchParams: any;
  handleSearchChange: (field: string, value: string) => void;
  handleSortChange: (e: any) => void;
  sorted: string;
}
const RoomFilters: React.FC<Props> = ({
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
          { label: "Room Name", field: "roomName", type: "text" },
          {
            label: "Type",
            field: "type",
            type: "select",
            options: [
              { value: "", label: "All Type" },
              { value: RoomType.Single, label: RoomType.Single },
              { value: RoomType.Double, label: RoomType.Double },
              { value: RoomType.Quad, label: RoomType.Quad },
              { value: RoomType.Studio, label: RoomType.Studio },
            ],
          },
          { label: "Price", field: "price", type: "text" },
          {
            label: "Status",
            field: "status",
            type: "select",
            options: [
              { value: "", label: "All Status" },
              { value: RoomStatus.Available, label: RoomStatus.Available },
              { value: RoomStatus.Occupied, label: RoomStatus.Occupied },
            ],
          },
        ]}
      />
      <SortOption
        options={[
          { value: "roomName", label: "By Room Name" },
          { value: "type", label: "By Type" },
          { value: "price", label: "By Price Increase" },
          { value: "-price", label: "By Price Decrease" },
          { value: "status", label: "By Status" },
        ]}
        sorted={sorted}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default RoomFilters;
