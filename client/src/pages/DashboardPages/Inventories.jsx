import React, { useEffect } from "react";
import Layout from "./Layout";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import InventoryCategories from "../../components/DashboardComponents/InventoryCategories";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import SearchElement from "../../common/SearchElement";
import Pagination from "../../common/Pagination";
import InventoriesTable from "../../components/DashboardComponents/InventoriesTable";
import Loader from "../../common/Loader";
import { getAllInventories } from "../../features/inventory/inventorySlice";

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
    "Item Cabinet",
    "Item Category",
    "Total Items",
    "Created At",
    "Updated At",
    "Item Status",
    "Is Consumable?",
    " ",
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const { inventories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );
  const { items, totalPages, limit, totalItems } = inventories;

  const dispatch = useDispatch();

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
      dispatch(getAllInventories({ page, sort, categories, search }));
    }
  }, [setPage, setSearchParams, search, sort, isError, isSuccess, message]);

  // handle sort
  const handleSort = (column) => {
    const sortFileMap = {
      "Item Info": "asset_name",
      "Item Location": "location",
      "item Cabinet": "cabinet",
      "Serial Number": "serial_number",
      "Item Category": "categories",
      "Total Items": "total_items",
      "Item Added By": "added_by",
      "Created At": "publishedAt",
      "Updated At": "updatedAt",
      "Item Status": "item_status",
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
      <div className="flex w-full flex-col md:flex-row justify-between md:items-center">
        <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl mb-2 md:mb-0">
          Inventories List
        </h3>

        <div className="flex gap-2 flex-col md:flex-row justify-center md:items-center">
          <a href="/add_inventory">
            <Button
              className="flex items-center capitalize bg-purple-500"
              size="sm"
            >
              <IoIosAddCircleOutline className="mr-1 text-lg" />
              Add Inventory
            </Button>
          </a>

          <a href="/inventories_report">
            <Button
              className="flex items-center capitalize bg-indigo-500"
              size="sm"
            >
              <MdOutlineFileDownload className="mr-1 text-lg" />
              Download Report
            </Button>
          </a>
        </div>
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
            />
          )}
        </div>

        {/* pagination */}
        {totalItems > 0 ? (
          <Pagination
            totalPage={search ? Math.ceil(totalItems / limit) : totalPages}
            page={page}
            setPage={setPage}
            bgColor="blue"
          />
        ) : (
          ""
        )}
      </div>
    </Layout>
  );
};

export default Inventories;
