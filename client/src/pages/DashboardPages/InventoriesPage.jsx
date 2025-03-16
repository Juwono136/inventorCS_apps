import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

// icons and material-tailwind
import { Button, Progress } from "@material-tailwind/react";
import { IoIosAddCircleOutline } from "react-icons/io";

// components
import Layout from "./Layout";
import InventoriesTableComponent from "../../components/DashboardComponents/InventoriesTableComponent";
import ExcelImportExportComponent from "../../components/DashboardComponents/ExcelImportExportComponent";
import SearchElement from "../../common/SearchElement";
import Pagination from "../../common/Pagination";
import Loader from "../../common/Loader";
import FilterCheckBox from "../../common/FilterCheckBox";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import { getInventoriesByProgram } from "../../features/inventory/inventorySlice";

const InventoriesPage = ({
  sort,
  setSort,
  categories,
  setCategories,
  page,
  setPage,
  search,
  setSearch,
}) => {
  UseDocumentTitle("Inventories List");

  const TABLE_HEAD = [
    "No.",
    "Item Info",
    "Item Location",
    "Item Cabinet",
    "Item Category",
    "Total Items",
    "Item Status",
    "Is Consumable?",
  ];
  const [progress, setProgress] = useState(0);
  const [inventoryData, setInventoryData] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const { inventories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );
  const { items, totalPages, limit, totalItems } = inventories;

  const dispatch = useDispatch();

  const [debouncedSearch] = useDebounce(search, 500);

  // Sets the page when the component is first mounted to match the URL.
  useEffect(() => {
    setPage(currentPage);
  }, []);

  // Sync search with URL
  useEffect(() => {
    if (searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  // Reset page to 1 when search changes
  useEffect(() => {
    if (debouncedSearch) {
      setPage(1);
      setSearchParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // Fetch data after ensuring the page matches the URL
  useEffect(() => {
    if (page === currentPage) {
      dispatch(
        getInventoriesByProgram({
          page,
          sort,
          categories,
          search: debouncedSearch || "",
        })
      );
    }
  }, [debouncedSearch, categories, page, sort, dispatch, currentPage]);

  // Make sure the URL is always updated with the state
  useEffect(() => {
    setSearchParams({
      page,
      search,
    });

    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
    }
  }, [page, search, isError, isSuccess, message]);

  // handle progress bar
  const handleProgressBar = (value) => {
    setProgress(value);
    if (value === 100) {
      setTimeout(() => setProgress(0), 2000);
    }
  };

  // handle sort
  const handleSort = (column) => {
    const sortFileMap = {
      "Item Info": "asset_name",
      "Item Location": "location",
      "Item Cabinet": "cabinet",
      "Item Category": "categories",
      "Total Items": "total_items",
      "Item Status": "item_status",
      "Is Consumable?": "is_consumable",
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
      {/* progress bar */}
      {progress > 0 && (
        <Progress
          value={progress}
          color="indigo"
          className="transition-all duration-500 my-1"
        />
      )}
      <ExcelImportExportComponent
        handleProgressBar={handleProgressBar}
        setData={setInventoryData}
      />

      <DynamicBreadcrumbs />
      <div className="flex w-full flex-col md:flex-row justify-between md:items-center">
        <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl mb-2 md:mb-0">
          Inventories List
        </h3>

        <div className="flex gap-2 w-max flex-col md:flex-row justify-center md:items-center">
          <a href="inventories/add_inventory">
            <Button
              className="flex items-center capitalize bg-purple-500"
              size="sm"
            >
              <IoIosAddCircleOutline className="mr-1 text-lg" />
              Add Inventory
            </Button>
          </a>
        </div>
      </div>
      <hr className="w-full border-indigo-100 my-4" />

      <div className="flex gap-4 flex-col">
        <div className="flex basis-1/5 flex-col md:flex-row gap-4">
          <SearchElement setSearch={setSearch} />

          <FilterCheckBox
            filterValues={inventories?.categories || []}
            setFilter={(categories) => setCategories(categories)}
            setPage={setPage}
            filterTitle="Filter by Category"
          />
        </div>

        <div className="basis-4/5 overflow-x-auto md:w-full">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <InventoriesTableComponent
              items={items}
              TABLE_HEAD={TABLE_HEAD}
              handleSort={handleSort}
            />
          )}
        </div>

        <div className="flex">
          <p className="text-xs text-blue-gray-800">
            Total Items: {totalItems}
          </p>
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

export default InventoriesPage;
