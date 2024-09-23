import React from "react";
import {
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { BsPencilSquare } from "react-icons/bs";
import { TbArrowsSort } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const InventoriesTable = ({
  items,
  TABLE_HEAD,
  handleSort,
  handleOpenDialogDraft,
  users,
}) => {
  const findAuthorDetails = (authorId) => {
    const author = users?.find((user) => user._id === authorId);
    return author ? author.personal_info : { name: "Unknown", email: "N/A" };
  };

  return (
    <table className="min-w-max md:w-full table-auto text-left">
      <thead className="sticky top-0 bg-blue-gray-50">
        <tr>
          {TABLE_HEAD.map((head, index) => (
            <th
              key={head}
              className={`cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors ${
                head !== "No." ? "hover:bg-blue-gray-100" : ""
              }`}
              onClick={() => head !== "No." && handleSort(head)}
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
              >
                {head}{" "}
                {head !== "No." && index !== TABLE_HEAD.length - 1 && (
                  <TbArrowsSort
                    strokeWidth={2}
                    className="h-4 w-4 hover:text-indigo-700"
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
              <h4 className="p-3 text-sm text-gray-800 font-medium">
                User not found.
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
              categories,
              total_items,
              author,
              updatedAt,
            },
            index
          ) => {
            const isLast = index === items.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            const { name: AuthorName } = findAuthorDetails(author);

            return (
              <tr key={asset_name} className="hover:bg-gray-200">
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
                  <div className="flex items-center gap-3">
                    <Avatar src={asset_img} alt={asset_name} size="sm" />
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {asset_name}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                      >
                        {asset_id}
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
                      {room_number}
                    </Typography>
                  </div>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {serial_number}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal capitalize"
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
                    {new Date(updatedAt).toLocaleDateString()}
                  </Typography>
                </td>

                <td className={classes}>
                  <div className="w-max">
                    <Chip
                      size="sm"
                      value={total_items > 0 ? "Ready" : "Out of stock"}
                      color={total_items > 0 ? "green" : "red"}
                    />
                  </div>
                </td>
                <td className={classes}>
                  <Link to={`update_inventory/${_id}`}>
                    <Tooltip content="Edit Inventory">
                      <IconButton variant="text">
                        <BsPencilSquare className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </Link>

                  <Tooltip content="Draft Inventory">
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => handleOpenDialogDraft(_id)}
                    >
                      <FaRegTrashAlt className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
};

export default InventoriesTable;
