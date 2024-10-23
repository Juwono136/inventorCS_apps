import React, { useEffect, useState } from "react";
import { Avatar, Chip, IconButton, Tooltip } from "@material-tailwind/react";
import { FaRegEdit } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { useDragScroll } from "../../utils/handleMouseDrag";
import DialogOpenComponent from "./DialogOpenComponent";
import { useDispatch } from "react-redux";
import { deleteInventory } from "../../features/inventory/inventorySlice";
import { accessToken } from "../../features/token/tokenSlice";

const InventoriesTable = ({ items, users, TABLE_HEAD, handleSort }) => {
  const {
    tableRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [authorDetails, setAuthorDetails] = useState({});

  const findAuthorDetails = (authorId) => {
    const author = users?.find((user) => user._id === authorId);
    return { ...author?.personal_info };
  };

  const dispatch = useDispatch();

  const handleOpenDialog = (id = null) => {
    setSelectedItemId(id);
    setOpenDialog(!openDialog);
  };

  const handleDeleteInventory = (e) => {
    e.preventDefault();

    if (selectedItemId) {
      dispatch(deleteInventory(selectedItemId)).then((res) => {
        dispatch(accessToken(res));
      });

      setOpenDialog(false);
      setSelectedItemId(null);
    }
  };

  useEffect(() => {
    if (items?.length > 0 && users?.length > 0) {
      const authorData = {};
      items.forEach((item) => {
        const author = findAuthorDetails(item.added_by);
        if (author) {
          authorData[item._id] = author.name;
        }
      });
      setAuthorDetails(authorData);
    }
  }, [items, users]);

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
        <thead className="sticky top-0 bg-blue-gray-50 z-30">
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={head}
                className={`cursor-pointer border-y border-indigo-500 bg-blue-800 p-4 transition-colors ${
                  head !== "No." ? "hover:bg-blue-700" : ""
                }`}
                onClick={() => head !== "No." && handleSort(head)}
              >
                <p className="flex items-center justify-between gap-2 font-normal text-sm leading-none opacity-70 text-white">
                  {head}{" "}
                  {head !== "No." && index !== TABLE_HEAD.length - 1 && (
                    <TbArrowsSort
                      strokeWidth={2}
                      className="h-4 w-4 hover:text-indigo-200"
                    />
                  )}
                </p>
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
                updatedAt,
                publishedAt,
                is_consumable,
              },
              index
            ) => {
              const isLast = index === items.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              const statusColors = {
                Available: "green",
                Maintenance: "orange",
                Lost: "red",
                Damaged: "purple",
              };

              const authorName = authorDetails[_id] || "Unknown";

              const itemUrl = `${window.location.origin}/inventory/${asset_id}`;

              return (
                <tr key={index} className="hover:bg-indigo-50">
                  <td className={classes}>
                    <div className="flex flex-col">
                      <p className="font-normal text-sm text-blue-gray-700">
                        {index + 1}
                      </p>
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
                        <p className="font-semibold text-sm text-blue-800">
                          {asset_name}
                        </p>
                        <p className="opacity-80 font-normal text-xs text-indigo-900">
                          Item ID: {asset_id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <p className="font-normal text-sm text-blue-gray-700">
                        {location}
                      </p>
                      <p className="font-normal opacity-70 text-sm text-blue-gray-600">
                        Room: {room_number}
                      </p>
                    </div>
                  </td>
                  <td className={classes}>
                    <p className="font-normal text-sm text-blue-gray-700">
                      {cabinet}
                    </p>
                  </td>
                  <td className={classes}>
                    <p className="font-normal text-sm text-blue-gray-700">
                      {!serial_number.length ? "-" : serial_number}
                    </p>
                  </td>
                  <td className={classes}>
                    <p className="font-semibold capitalize text-orange-800 text-sm">
                      {categories.join(", ")}
                    </p>
                  </td>

                  <td className={classes}>
                    <p className="font-normal text-sm text-blue-gray-700">
                      {total_items}
                    </p>
                  </td>
                  <td className={classes}>
                    <p className="font-normal text-sm capitalize text-blue-gray-700">
                      {authorName}
                    </p>
                  </td>
                  <td className={classes}>
                    <p className="font-normal text-sm text-blue-gray-700">
                      {new Date(publishedAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className={classes}>
                    <p className="font-normal text-sm text-blue-gray-700">
                      {new Date(updatedAt).toLocaleDateString()}
                    </p>
                  </td>

                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        size="sm"
                        value={item_status}
                        color={statusColors[item_status] || "gray"}
                        variant="outlined"
                        className="rounded-full"
                      />
                    </div>
                  </td>

                  <td className={classes}>
                    <div className="w-full">
                      <p className="font-base text-center capitalize text-blue-500 text-sm">
                        {is_consumable === true ? "Yes" : "No"}
                      </p>
                    </div>
                  </td>

                  <td className={`${classes} sticky right-0 z-10 bg-gray-50`}>
                    <Link to={`update_inventory/${_id}`}>
                      <Tooltip content="Edit Inventory">
                        <IconButton variant="text" className="text-indigo-600">
                          <FaRegEdit className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                    </Link>

                    <Tooltip content="Delete Inventory">
                      <IconButton
                        variant="text"
                        className="text-red-600"
                        onClick={() => handleOpenDialog(_id)}
                      >
                        <FaRegTrashAlt className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      {/* save user open dialog */}
      <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={handleDeleteInventory}
        handleOpenDialog={handleOpenDialog}
        message="Are you sure want to delete this item?"
        btnText="Delete"
      />
    </div>
  );
};

export default InventoriesTable;
