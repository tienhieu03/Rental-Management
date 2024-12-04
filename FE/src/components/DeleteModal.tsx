import React from "react";
import { Popconfirm, Button } from "antd";
interface Props {
  onConfirm: (record: any) => Promise<void>; // Include record parameter
  record: any; // Add a record prop
}
const DeleteModal: React.FC<Props> = ({ onConfirm, record }) => {
  return (
    <Popconfirm
      title="Are you sure you want to delete?"
      onConfirm={async () => {
        await onConfirm(record); // Pass the record to the onConfirm function
      }}
      okText="Delete"
      cancelText="Cancel"
      overlayStyle={{ textAlign: "center" }} // Optional: To center the text
    >
      <Button
        icon={
          <i
            className="fa-solid fa-trash text-xl
        text-red-600
          "
          />
        }
        className=" transition"
      >
        Delete
      </Button>
    </Popconfirm>
  );
};
export default DeleteModal;
