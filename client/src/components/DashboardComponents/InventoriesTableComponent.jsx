import React from "react";

// icons and material-tailwind
import { Avatar, Chip } from "@material-tailwind/react";
import { RxCaretSort } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useDragScroll } from "../../utils/handleMouseDrag";

const InventoriesTablComponent = ({ items, TABLE_HEAD, handleSort }) => {
  const {
    tableRef,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  } = useDragScroll();

  const navigate = useNavigate();

  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedItemId, setSelectedItemId] = useState(null);

  // const dispatch = useDispatch();

  // const handleOpenDialog = (id = null) => {
  //   setSelectedItemId(id);
  //   setOpenDialog(!openDialog);
  // };

  // delete inventory app
  // const handleDeleteInventory = (e) => {
  //   e.preventDefault();

  //   if (selectedItemId) {
  //     dispatch(deleteInventory(selectedItemId)).then((res) => {
  //       dispatch(accessToken(res));
  //     });

  //     setOpenDialog(false);
  //     setSelectedItemId(null);
  //   }
  // };

  return (
    <div
      className="overflow-x-auto w-full h-screen rounded-lg"
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
                <p className="flex items-center justify-between gap-2 font-normal text-sm leading-none text-white">
                  {head}{" "}
                  {head !== "No." && index !== TABLE_HEAD.length - 1 && (
                    <RxCaretSort className="text-xl hover:text-indigo-200" />
                  )}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items?.length === 0 && (
            <tr>
              <td>
                <h4 className="p-3 text-sm text-center text-red-800 font-semibold">
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
                location,
                room_number,
                cabinet,
                categories,
                total_items,
                item_status,
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

              const handleRowClick = () => {
                navigate(`update_inventory/${_id}`);
              };

              // const itemUrl = `${window.location.origin}/inventory/${asset_id}`;

              return (
                <tr
                  key={index}
                  className="hover:bg-indigo-50 hover:cursor-pointer"
                  onClick={handleRowClick}
                >
                  <td className={classes}>
                    <div className="flex flex-col">
                      <p className="font-normal text-sm text-blue-gray-700">
                        {index + 1}
                      </p>
                    </div>
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
                    <p className="font-semibold capitalize text-orange-800 text-sm">
                      {categories.join(", ")}
                    </p>
                  </td>

                  <td className={classes}>
                    <p className="font-normal text-sm text-center text-blue-gray-700">
                      {total_items}
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

                  {/* <td className={`${classes} sticky right-0 z-10 bg-gray-50`}>
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
                  </td> */}
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      {/* delte inventory open dialog */}
      {/* <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={handleDeleteInventory}
        handleOpenDialog={handleOpenDialog}
        message="Are you sure want to delete this item?"
        btnText="Delete"
      /> */}
    </div>
  );
};

export default InventoriesTablComponent;
