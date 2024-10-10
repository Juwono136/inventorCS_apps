import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InventoryLayout from "./InventoryLayout";
import InventoryCard from "../../components/HomeComponents/InventoryCard";
import SearchElement from "../../common/SearchElement";
import ItemCategories from "../../components/InventoryComponents/ItemCategories";
import { useCart } from "../../components/InventoryComponents/CartContext";
import SortBy from "../../components/InventoryComponents/SortBy";
import Pagination from "../../common/Pagination"; 
import { getAllInventories } from "../../features/inventory/inventorySlice";
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

const Inventory = ({
  sort,
  setSort,
  categories,
  setCategories,
  page,
  setPage,
  search,
  setSearch,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page"));
  const { addToCart } = useCart();
  const { inventories, isLoading, isError, isSuccess, message } = useSelector((state) => state.inventory);
  const { items, totalItems, totalPage, limit } = inventories;

  const dispatch = useDispatch();

  const handleSearch = (term) => {
    setSearch(term);
    setSearchParams({ ...searchParams, search: term });
    setPage(1);
  };

  const handleSort = (sortOption) => {
    const sortFieldMap = {
      "Name": "asset_name",
      "Total Items": "total_items",
    };
  
    const selectedSortField = sortFieldMap[sortOption];
    if (selectedSortField) {
      const newOrder =
        sort.sort === selectedSortField && sort.order === "asc"
          ? "desc"
          : "asc";
      setSort({ sort: selectedSortField, order: newOrder });
    }
  };
  
  const handleToggleSort = () => {
      const newOrder = sort.order === "asc" ? "desc" : "asc";
      setSort({ sort:sort.sort, order: newOrder });
  };

  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
      setSearchParams({
        page: currentPage,
        sort: sort.sort,
        order: sort.order,
        search,
      });
    }

    if (isError) {
      // toast.error(message);
    }

    if (isSuccess) {
      dispatch(getAllInventories({ page, sort, categories, search }));
    }

  }, [setPage, setSearchParams, search, sort, isError, isSuccess, message, categories]);

  return (
    <InventoryLayout>
      <div className="flex gap-4 flex-col">
        
        <div className="flex justify-between items-center mb-4">
          <SearchElement setSearch={handleSearch} />
          <div className="flex flex-row items-center gap-4">
            <button className="p-1" onClick={handleToggleSort}>
              {sort.sort === "total_items" 
                ? (sort.order === "asc" ? <FaSortAmountDownAlt /> : <FaSortAmountDown />)
                : (sort.order === "asc" ? <FaSortAmountDown /> : <FaSortAmountDownAlt />)}
            </button>
            <SortBy sort={sort} setSort={handleSort} />
          </div>
        </div>

        <div className="flex gap-4 flex-row">
          <div className="w-64 bg-white shadow-md p-4 rounded-lg">
            <ItemCategories
              categories={inventories?.categories ? inventories?.categories : []}
              setFilterCategories={(categories) => setCategories(categories)}
              setPage={setPage}
            />
          </div>
          
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:mx-6 p-4">
            {items?.map((item, i) => (
              <InventoryCard
                key={i}
                image={item.asset_img}
                title={item.asset_name}
                serial_number={item.serial_number}
                total_items={item.total_items}
                status={item.total_items > 0 ? "Ready" : "Out of stock"}
                categories={item.categories}
                desc={item.desc}
                addToCart={() => addToCart(item)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {totalItems > 0 ? (
        <Pagination
          totalPage={search ? Math.ceil(totalItems / limit) : totalPage}
          page={page}
          setPage={setPage}
        />
      ) : (
        ""
      )}
    </InventoryLayout>
  );
};

export default Inventory;
