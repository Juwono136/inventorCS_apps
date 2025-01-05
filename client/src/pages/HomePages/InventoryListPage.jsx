import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

const InventoryListPage = ({
  sort,
  setSort,
  categories,
  setCategories,
  page,
  setPage,
  search,
  setSearch,
}) => {
  UseDocumentTitle("Our Inventories");

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
    }
  }, [setPage, setSearchParams, search, sort, isError, isSuccess, message]);

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

  const sortedItems = items
    ? [...items].sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      )
    : [];

  return (
    <div className="flex flex-col mx-6 my-6 md:mx-8">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-base md:text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
          Inventories List
        </h2>
      </div>

      <div className="flex flex-col w-full gap-4 my-6">
        {/* search and filter section */}
        <div className="flex flex-col md:flex-row w-full gap-4">
          <SearchElement setSearch={handleSearch} />

          <FilterCheckBox
            filterValues={
              inventories?.categories ? inventories?.categories : []
            }
            setFilter={(categories) => setCategories(categories)}
            setPage={setPage}
            filterTitle="Filter by Category"
          />
        </div>

        {/* inventory list section */}
        <div className="w-full mt-4">
          {isLoading ? (
            <Loader />
          ) : items?.length === 0 ? (
            <h4 className="p-3 text-base text-center font-semibold text-red-900">
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

        {/* pagination */}
        {totalItems > 0 ? (
          <Pagination
            totalPage={search ? Math.ceil(totalItems / limit) : totalPages}
            page={page}
            setPage={setPage}
            bgColor="indigo"
          />
        ) : (
          ""
        )}
      </div>

      <FooterComponent />
      <ScrollUp />
    </div>
  );
};

export default InventoryListPage;
