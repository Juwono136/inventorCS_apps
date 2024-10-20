import React, { useEffect } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../common/Pagination";
import SearchElement from "../../common/SearchElement";
import { useSearchParams } from "react-router-dom";
import Loader from "../../common/Loader";
import ProgramCategories from "../../components/DashboardComponents/ProgramCategories";
// import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import { getAllUsersInfor } from "../../features/user/userSlice";
// import { accessToken } from "../../features/token/tokenSlice";
import toast from "react-hot-toast";
import UserTable from "../../components/DashboardComponents/UserTable";

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
  const TABLE_HEAD = [
    "No.",
    "Member Info",
    "Program & Address",
    "Role",
    "Status",
    "Joined At",
    "",
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page"));
  // const [openDialogDelete, setOpenDialogDelete] = useState(false);
  // const [deleteUserId, setDeleteUserId] = useState(null);

  const { allUsersInfor, userInfor, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.user);
  const { users, totalPage, limit, totalUsers } = allUsersInfor;

  const dispatch = useDispatch();

  // const handleOpenDialogDelete = (id) => {
  //   setOpenDialogDelete(!openDialogDelete);
  //   setDeleteUserId(id);
  // };

  // const handleDeleteUser = (e, id) => {
  //   e.preventDefault();

  //   dispatch(deleteUser(id)).then((res) => {
  //     dispatch(accessToken(res));
  //     setPage(1);
  //     setSearchParams({ page: 1, search });
  //   });

  //   setOpenDialogDelete(!openDialogDelete);
  // };

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
      if (userInfor.personal_info?.role.includes(1)) {
        dispatch(getAllUsersInfor({ page, sort, program, search }));
      }
    }
  }, [setPage, setSearchParams, search, sort, isError, isSuccess, message]);

  // handle sort
  const handleSort = (column) => {
    const sortFileMap = {
      "Member Info": "personal_info.name",
      "Program & Address": "personal_info.program",
      Role: "personal_info.role",
      Status: "personal_info.status",
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
            <UserTable
              users={users}
              TABLE_HEAD={TABLE_HEAD}
              handleSort={handleSort}
            />
          )}
        </div>

        {/* pagination */}
        {totalUsers > 0 ? (
          <Pagination
            totalPage={search ? Math.ceil(totalUsers / limit) : totalPage}
            page={page}
            setPage={setPage}
            bgColor="blue-gray"
          />
        ) : (
          ""
        )}
      </div>

      {/* delete user open dialog */}
      {/* <DialogOpenComponent
        openDialog={openDialogDelete}
        handleFunc={(e) => handleDeleteUser(e, deleteUserId)}
        handleOpenDialog={handleOpenDialogDelete}
        message="Are you sure want to delete this user permanently?"
        btnText="Delete"
      /> */}
    </Layout>
  );
};

export default UserList;
