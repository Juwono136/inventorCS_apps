import React from "react";
import { useSelector } from "react-redux";

// components
import InventoryDetailComponent from "../../components/HomeComponents/InventoryDetailComponent";
import FooterComponent from "../../components/HomeComponents/FooterComponent";
import InventoryCardComponent from "../../components/HomeComponents/InventoryCardComponent";
import Loader from "../../common/Loader";
import BackButton from "../../common/BackButton";
import UseDocumentTitle from "../../common/UseDocumentTitle";
import ScrollUp from "../../common/ScrollUp";

const InventoryDetailPage = () => {
  UseDocumentTitle("Item Detail");

  const { inventories } = useSelector((state) => state.inventory);
  const { items, isLoading } = inventories;

  const sortedItems = items
    ? [...items].sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      )
    : [];

  return (
    <div className="mx-6 md:mx-8 my-4">
      <div className="flex items-center">
        <BackButton link="/inventory-list" />
      </div>
      <InventoryDetailComponent />

      <div className="mt-24">
        {isLoading ? (
          <Loader />
        ) : items?.length === 0 ? (
          <h4 className="p-3 text-base text-center font-semibold text-red-900">
            Sorry, Inventory is not available for now.
          </h4>
        ) : (
          <div className="flex flex-col m-3 md:mx-3">
            <div className="flex my-4 w-full justify-between items-center">
              <h2 className="text-xl md:text-2xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Latest inventory
              </h2>

              <a
                href="/inventory-list"
                className="text-xs text-white py-2 px-3 bg-indigo-500 rounded-md hover:underline hover:bg-indigo-400 transition-all"
              >
                See more
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 bg-indigo-200/20 p-6 rounded-md shadow-md">
              {sortedItems?.slice(0, 5).map((item, i) => (
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
          </div>
        )}
      </div>

      <FooterComponent />
      <ScrollUp />
    </div>
  );
};

export default InventoryDetailPage;
