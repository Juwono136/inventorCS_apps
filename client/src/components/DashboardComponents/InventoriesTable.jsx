import React from "react";
import {
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { FaRegEdit } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { MdFolderDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { useDragScroll } from "../../utils/handleMouseDrag";

const InventoriesTable = ({ items, TABLE_HEAD, handleSort, users }) => {
  const {
    tableRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  const findAuthorDetails = (authorId) => {
    const author = users?.find((user) => user._id === authorId);
    return author ? author?.personal_info : { name: "N/A", email: "N/A" };
  };

  return (
    <div
      className="overflow-x-auto w-full h-screen"
      style={{ cursor: "grab", height: "80vh" }}
      ref={tableRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <table className="min-w-max md:w-full table-auto text-left">
        <thead className="sticky top-0 bg-blue-gray-50 z-20">
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={head}
                className={`cursor-pointer border-y border-indigo-500 bg-blue-800 p-4 transition-colors ${
                  head !== "No." ? "hover:bg-blue-700" : ""
                }`}
                onClick={() => head !== "No." && handleSort(head)}
              >
                <Typography
                  variant="small"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 text-white"
                >
                  {head}{" "}
                  {head !== "No." && index !== TABLE_HEAD.length - 1 && (
                    <TbArrowsSort
                      strokeWidth={2}
                      className="h-4 w-4 hover:text-indigo-200"
                    />
                  )}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items?.length === 0 && (
            <tr>
              <td colSpan="5">
                <h4 className="p-3 text-sm text-red-800 font-medium">
                  Item not found.
                </h4>
              </td>
            </tr>
          )}

          {items?.map(
            (
              {
                _id,
                asset_id,
                asset_name,
                asset_img,
                serial_number,
                location,
                room_number,
                cabinet,
                categories,
                total_items,
                item_status,
                added_by,
                draft,
                updatedAt,
                publishedAt,
              },
              index
            ) => {
              const isLast = index === items.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              const { name: AuthorName } = findAuthorDetails(added_by);

              const itemUrl = `${window.location.origin}/inventory/${asset_id}`;

              return (
                <tr key={asset_name} className="hover:bg-indigo-50">
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {index + 1}
                      </Typography>
                    </div>
                  </td>

                  <td className={classes}>
                    <QRCode
                      value={itemUrl}
                      size={64}
                      logoWidth={16}
                      eyeRadius={10}
                      eyeColor="#161D6F"
                      fgColor="#161D6F"
                      qrStyle="dots"
                    />
                  </td>

                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar src={asset_img} alt={asset_name} size="sm" />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-semibold text-sm text-blue-800"
                        >
                          {asset_name}
                        </Typography>
                        <Typography
                          variant="small"
                          className="opacity-80 font-normal text-indigo-900"
                        >
                          Item ID: {asset_id}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {location}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                      >
                        Room: {room_number}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {cabinet}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {!serial_number.length ? "-" : serial_number}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-semibold capitalize text-orange-800"
                    >
                      {categories.join(", ")}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal capitalize text-center"
                    >
                      {total_items}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal capitalize text-center"
                    >
                      {AuthorName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {new Date(publishedAt).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {new Date(updatedAt).toLocaleDateString()}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        size="sm"
                        value={item_status}
                        color="green"
                        variant="outlined"
                        className="rounded-full"
                      />
                    </div>
                  </td>

                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        size="sm"
                        value={draft === true ? "Draft" : "Ready"}
                        color={draft === true ? "red" : "green"}
                        variant="ghost"
                        className="rounded-full"
                      />
                    </div>
                  </td>
                  <td className={classes}>
                    <Link to={`update_inventory/${_id}`}>
                      <Tooltip content="Edit Inventory">
                        <IconButton variant="text" className="text-indigo-600">
                          <FaRegEdit className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoriesTable;
