import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

// components
import InventoryCardComponent from "../../components/HomeComponents/InventoryCardComponent";
import FooterComponent from "../../components/HomeComponents/FooterComponent";
import UseDocumentTitle from "../../common/UseDocumentTitle";
import SearchElement from "../../common/SearchElement";
import FilterCheckBox from "../../common/FilterCheckBox";
import Loader from "../../common/Loader";
import Pagination from "../../common/Pagination";
import ScrollUp from "../../common/ScrollUp";

// features
import { getAllInventories } from "../../features/inventory/inventorySlice";

const InventoryListPage = ({
  sort,
  categories,
  setCategories,
  page,
  setPage,
  search,
  setSearch,
}) => {
  UseDocumentTitle("Our Inventories");

  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  // const searchQuery = searchParams.get("search") || "";

  const { inventories, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );
  const { items, totalPages, limit, totalItems } = inventories;

  const [debouncedSearch] = useDebounce(search, 500);

  // Sets the page when the component is first mounted to match the URL.
  useEffect(() => {
    setPage(currentPage);
  }, []);

  // Sync search with URL
  // useEffect(() => {
  //   if (searchQuery !== search) {
  //     setSearch(searchQuery);
  //   }
  // }, [searchQuery]);

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
        getAllInventories({
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

  const sortedItems = items
    ? [...items].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    : [];

  return (
    <div className="flex flex-col mx-6 my-6 md:mx-8">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-base md:text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
          Inventories List
        </h2>
      </div>

      <div className="flex flex-col w-full gap-4 my-6">
        {/* Search dan filter */}
        <div className="flex flex-col md:flex-row w-full gap-4">
          <SearchElement setSearch={setSearch} />

          <FilterCheckBox
            filterValues={inventories?.categories || []}
            setFilter={(categories) => setCategories(categories)}
            setPage={setPage}
            filterTitle="Filter by Category"
          />
        </div>

        {/* Inventory List */}
        <div className="w-full mt-4">
          {isLoading ? (
            <Loader />
          ) : items?.length === 0 ? (
            <h4 className="p-3 text-base text-center font-semibold text-red-900 bg-red-100 rounded-full">
              Sorry, Inventory not found.
            </h4>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {sortedItems?.map((item, i) => (
                <InventoryCardComponent
                  key={i}
                  itemId={item._id}
                  image={item.asset_img}
                  title={item.asset_name}
                  serial_number={item.serial_number}
                  total_items={item.total_items}
                  status={item.item_status}
                  categories={item.categories}
                  desc={item.desc}
                  is_consumable={item.is_consumable}
                  item_program={item.item_program}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            totalPage={search ? Math.ceil(totalItems / limit) : totalPages}
            page={page}
            setPage={setPage}
            bgColor="indigo"
          />
        )}
      </div>

      <FooterComponent />
      <ScrollUp />
    </div>
  );
};

export default InventoryListPage;
