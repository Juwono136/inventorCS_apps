import React, { useEffect, useState } from "react";
import Layout from "./Layout";
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
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import SearchElement from "../../common/SearchElement";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../../common/Loader";
import ProgramCategories from "../../components/DashboardComponents/ProgramCategories";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import { deleteUser, getAllUsersInfor } from "../../features/user/userSlice";
import { accessToken } from "../../features/token/tokenSlice";
import toast from "react-hot-toast";

const UserList = ({
  sort,
  setSort,
  program,
  setProgram,
  page,
  setPage,
  search,
  setSearch,
}) => {
  const TABLE_HEAD = ["No.", "Member", "Program", "Role", "Joined At", ""];

  const [searchParams, setSearchParams] = useSearchParams();
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const currentPage = parseInt(searchParams.get("page"));

  const { allUsersInfor, userInfor, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.user);
  const { users, totalPage, limit, totalUsers } = allUsersInfor;

  const dispatch = useDispatch();

  const handleOpenDialogDelete = (id) => {
    setOpenDialogDelete(!openDialogDelete);
    setDeleteUserId(id);
  };

  const handleDeleteUser = (e, id) => {
    e.preventDefault();

    dispatch(deleteUser(id)).then((res) => {
      dispatch(accessToken(res));
      setPage(1);
      setSearchParams({ page: 1, search });
    });

    setOpenDialogDelete(!openDialogDelete);
  };

  const handleSearch = (term) => {
    setSearch(term);
    setSearchParams({ ...searchParams, search: term });
    setPage(1);
  };

  useEffect(() => {
    // get the page number from the URL parameters when the component mounts
    if (currentPage) {
      setPage(currentPage);
      setSearchParams({
        page: currentPage,
        search,
        sort: sort.sort,
        order: sort.order,
      });
    }

    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
      if (userInfor.personal_info?.role === 1) {
        dispatch(getAllUsersInfor({ page, sort, program, search }));
      }
    }
  }, [setPage, setSearchParams, search, sort, isError, isSuccess, message]);

  // handle sort
  const handleSort = (column) => {
    const sortFileMap = {
      Member: "personal_info.name",
      Program: "personal_info.program",
      Role: "personal_info.role",
      "Joined At": "joinedAt",
    };

    const selectedSortField = sortFileMap[column];
    if (selectedSortField) {
      const newOrder =
        sort.sort === selectedSortField && sort.order === "asc"
          ? "desc"
          : "asc";
      setSort({ sort: selectedSortField, order: newOrder });
    }
  };

  return (
    <Layout>
      <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
        Users List
      </h3>
      <hr className="w-full border-indigo-100 my-4" />

      <div className="flex gap-4 flex-col">
        <div className="flex basis-1/5 flex-col gap-2">
          {/* search */}
          <SearchElement setSearch={handleSearch} />

          {/* categories */}
          <ProgramCategories
            program={allUsersInfor?.program ? allUsersInfor?.program : []}
            setFilterProgram={(program) => setProgram(program)}
            setPage={setPage}
          />
        </div>

        <div className="basis-4/5 overflow-x-auto md:w-full">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
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
                {/* user not found */}
                {users?.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <h4 className="p-3 text-sm text-gray-800 font-medium">
                        User not found.
                      </h4>
                    </td>
                  </tr>
                )}

                {users?.map(({ personal_info, _id, joinedAt }, index) => {
                  const { avatar, name, email, role, program, address } =
                    personal_info;
                  const isLast = index === users.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

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
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={
                              role === 1
                                ? "admin"
                                : role === 2
                                ? "staff"
                                : "user"
                            }
                            color={
                              role === 1
                                ? "green"
                                : role === 2
                                ? "orange"
                                : "blue"
                            }
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

                        {/* Delete user button */}
                        <Tooltip content="Delete User">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => handleOpenDialogDelete(_id)}
                          >
                            <FaRegTrashAlt className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* pagination */}
        {totalUsers > 0 ? (
          <Pagination
            totalPage={search ? Math.ceil(totalUsers / limit) : totalPage}
            page={page}
            setPage={setPage}
          />
        ) : (
          ""
        )}
      </div>

      {/* delete user open dialog */}
      <DialogOpenComponent
        openDialog={openDialogDelete}
        handleFunc={(e) => handleDeleteUser(e, deleteUserId)}
        handleOpenDialog={handleOpenDialogDelete}
        message="Delete user?"
        btnText="Delete"
      />
    </Layout>
  );
};

export default UserList;
