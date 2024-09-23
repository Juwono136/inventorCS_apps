import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { MdOutlineFileDownload } from "react-icons/md";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import InventoryCategories from "../../components/DashboardComponents/InventoryCategories";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllInventories } from "../../features/inventory/inventorySlice";
import SearchElement from "../../common/SearchElement";
import Pagination from "../../common/Pagination";
import InventoriesTable from "../../components/DashboardComponents/InventoriesTable";
import Loader from "../../common/Loader";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";

const Inventories = ({
  sort,
  setSort,
  categories,
  setCategories,
  page,
  setPage,
  search,
  setSearch,
}) => {
  const TABLE_HEAD = [
    "No.",
    "Item Info",
    "Item Location",
    "Serial Number",
    "Category",
    "Total Items",
    "Item Added By",
    "Updated At",
    "Status",
    " ",
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDialogDraft, setOpenDialogDraft] = useState(false);
  const [draftInventoryId, setDraftInventoryId] = useState(null);
  const currentPage = parseInt(searchParams.get("page"));

  const { allUsersInfor } = useSelector((state) => state.user);
  const { users } = allUsersInfor;
  const { inventories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );
  const { items, limit, totalPages, totalItems } = inventories;

  const dispatch = useDispatch();

  const handleOpenDialogDraft = (id) => {
    setOpenDialogDraft(!openDialogDraft);
    setDraftInventoryId(id);
  };

  const handleDraftInventory = (e, id) => {
    e.preventDefault();

    // dispatch(deleteUser(id)).then((res) => {
    //   dispatch(accessToken(res));
    //   setPage(1);
    //   setSearchParams({ page: 1, search });
    // });

    setOpenDialogDraft(!openDialogDraft);
  };

  const handleSearch = (term) => {
    setSearch(term);
    setSearchParams({ ...searchParams, search: term });
    setPage(1);
  };

  useEffect(() => {
    // get the page number from the URL parameters when the component mounts
    // if (currentPage) {
    //   setPage(currentPage);
    //   setSearchParams({
    //     page: currentPage,
    //     search,
    //     sort: sort.sort,
    //     order: sort.order,
    //   });
    // }
    // if (isError) {
    //   toast.error(message);
    // }
    // if (isSuccess) {
    //   toast.success(message);
    // }
    // dispatch(getAllInventories({ page, sort, categories, search }));
  }, [setPage, setSearchParams, search, sort, isError, isSuccess, message]);

  // handle sort
  const handleSort = (column) => {
    // const sortFileMap = {
    //   Member: "personal_info.name",
    //   Program: "personal_info.program",
    //   Role: "personal_info.role",
    //   Status: "personal_info.status",
    //   "Joined At": "joinedAt",
    // };
    // const selectedSortField = sortFileMap[column];
    // if (selectedSortField) {
    //   const newOrder =
    //     sort.sort === selectedSortField && sort.order === "asc"
    //       ? "desc"
    //       : "asc";
    //   setSort({ sort: selectedSortField, order: newOrder });
    // }
  };

  return (
    <Layout>
      <div className="flex w-full flex-col md:flex-row justify-between md:items-center">
        <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
          Inventories List
        </h3>

        <a href="/inventories_report">
          <Button
            className="flex items-center my-3 capitalize bg-indigo-500"
            size="sm"
          >
            <MdOutlineFileDownload className="mr-1 text-lg" />
            Download Report
          </Button>
        </a>
      </div>
      <hr className="w-full border-indigo-100 my-4" />

      <div className="flex gap-4 flex-col">
        <div className="flex basis-1/5 flex-col gap-2">
          <SearchElement setSearch={handleSearch} />

          <InventoryCategories
            categories={inventories?.categories ? inventories?.categories : []}
            setFilterCategories={(categories) => setCategories(categories)}
            setPage={setPage}
          />
        </div>

        <div className="basis-4/5 overflow-x-auto md:w-full">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <InventoriesTable
              items={items}
              TABLE_HEAD={TABLE_HEAD}
              handleSort={handleSort}
              handleOpenDialogDraft={handleOpenDialogDraft}
              users={users}
            />
          )}
        </div>

        {/* pagination */}
        {totalItems > 0 ? (
          <Pagination
            totalPage={search ? Math.ceil(totalItems / limit) : totalPages}
            page={page}
            setPage={setPage}
          />
        ) : (
          ""
        )}
      </div>

      {/* draft item open dialog */}
      <DialogOpenComponent
        openDialog={openDialogDraft}
        handleFunc={(e) => handleDraftInventory(e, draftInventoryId)}
        handleOpenDialog={handleOpenDialogDraft}
        message="Are you sure want to draft the item?"
        btnText="Draft"
      />
    </Layout>
  );
};

export default Inventories;
