import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InventoryLayout from "./InventoryLayout";
import InventoryCard from "../../components/HomeComponents/InventoryCard";
import product1 from "../../assets/images/inventory_img.jpg";
import { itemList } from "../../utils/InventoryData";
import SearchElement from "../../common/SearchElement";
import ItemCategories from "../../components/InventoryComponents/ItemCategories";
import { useCart } from "../../components/InventoryComponents/CartContext";


// FYI the page wont load if i uncomment everything cause everything here is just madeup cause no backend 😀

const Inventory = (
  {
    category, //Same as UserList's "program"
    setCategory, //Same as UserList's "program"
    page,
    setPage,
    search,
    setSearch,
  }
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page"));
  const { addToCart } = useCart();

  // const { allItemsInfor, itemInfor, isError, isSuccess, message } =
  //   useSelector((state) => state.user);
  // const { items, totalPage, limit, totalItems } = allItemsInfor;

  // ❗❗❗NOTES❗❗❗
  // ^^^^ I cant really do anything about this cause i cant mess around with backend 😁

  const dispatch = useDispatch();

  const handleSearch = (term) => {
    setSearch(term);
    setSearchParams({ ...searchParams, search: term });
    setPage(1);
  };


  // useEffect(() => {
  //   if (currentPage) {
  //     setPage(currentPage);
  //     setSearchParams({
  //       page: currentPage,
  //       search,
  //     });
  //   }

  //   if (isError) {
  //     toast.error(message);
  //   }

  //   if (isSuccess) {
  //     toast.success(message);
  //     if (userInfor.personal_info?.role === 1) {
  //       dispatch(getAllItemsInfor({ page, category, search })); // its "category" instead of "program"
  //     }
  //   }
  // }, [setPage, setSearchParams, search, isError, isSuccess, message]);

  return (
    <InventoryLayout>

      
      <div className="flex gap-4 flex-col">

        <h3 className="text-base font-bold text-black-500/60 pointer-events-none sm:text-xl">
          Inventory Item List
        </h3>
        <hr className="w-full border-indigo-100 my-4" />

        <div className="flex basis-1/5 flex-col gap-2">

          <SearchElement 
            setSearch={handleSearch} //I Didnt change anything about the search, just called it
          /> 

          {/* <ItemCategories
            category={allItemsInfor?.Category ? allItemsInfor?.Category : []}
            // I changed this ^ "allItemsInfor" from "allUsersInfor" from UserList.jsx 
            
            setFilterItem={(category) => setCategory(category)}
            setPage={setPage}
          /> */}

        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:mx-6">
          {itemList.map((item) => (
            <InventoryCard
              key={item.item_id}
              image={product1}
              item={item}
              addToCart={() => addToCart(item)}
            />
          ))}
        </div>
        
        {/* {totalItems > 0 ? (
          <Pagination
            totalPage={search ? Math.ceil(totalItems / limit) : totalPage}
            page={page}
            setPage={setPage}
          />
        ) : (
          "" // Didnt change anything to Pagination only changing "totalUsers" to "totalItems"
        )} */}

      </div>

    </InventoryLayout>
  );
};

export default Inventory;
