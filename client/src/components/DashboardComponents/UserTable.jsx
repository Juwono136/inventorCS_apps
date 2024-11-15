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
import { Link } from "react-router-dom";
// import { FaRegTrashAlt } from "react-icons/fa";

const UserTable = ({
  users,
  TABLE_HEAD,
  handleSort,
  // handleOpenDialogDelete,
}) => {
  const getRoleColor = (role) => {
    if (role === 0) return "blue"; // User
    if (role === 1) return "green"; // Admin
    if (role === 2) return "orange"; // Staff
    return null;
  };

  const getRoleLabel = (role) => {
    if (role === 0) return "User";
    if (role === 1) return "Admin";
    if (role === 2) return "Staff";
    return null;
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
        {users?.length === 0 && (
          <tr>
            <td colSpan="5">
              <h4 className="p-3 text-sm text-red-800 font-medium">
                User not found.
              </h4>
            </td>
          </tr>
        )}

        {users?.map(({ personal_info, _id, joinedAt }, index) => {
          const { avatar, name, email, role, program, status, address } =
            personal_info;
          const isLast = index === users.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

          return (
            <tr key={name} className="hover:bg-gray-200">
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
                  <Avatar src={avatar} alt={name} size="sm" />
                  <div className="flex flex-col">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal opacity-70"
                    >
                      {email}
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
                    {program}
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-70"
                  >
                    {address}
                  </Typography>
                </div>
              </td>
              <td className={classes}>
                <div className="w-max flex flex-wrap gap-2">
                  {role.map((r) => {
                    const roleLabel = getRoleLabel(r);
                    const roleColor = getRoleColor(r);
                    return (
                      roleLabel && (
                        <Chip
                          key={r}
                          variant="ghost"
                          size="sm"
                          value={roleLabel}
                          color={roleColor}
                          className="rounded-full"
                        />
                      )
                    );
                  })}
                </div>
              </td>
              <td className={classes}>
                <div className="w-max">
                  <Chip
                    size="sm"
                    value={status === "active" ? "Active" : "Inactive"}
                    color={status === "active" ? "green" : "red"}
                  />
                </div>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {new Date(joinedAt).toLocaleDateString()}
                </Typography>
              </td>
              <td className={classes}>
                <Link to={`update_user/${_id}`}>
                  <Tooltip content="Edit User">
                    <IconButton variant="text">
                      <BsPencilSquare className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </Link>

                {/* <Tooltip content="Delete User">
                  <IconButton
                    variant="text"
                    color="red"
                    onClick={() => handleOpenDialogDelete(_id)}
                  >
                    <FaRegTrashAlt className="h-4 w-4" />
                  </IconButton>
                </Tooltip> */}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserTable;
