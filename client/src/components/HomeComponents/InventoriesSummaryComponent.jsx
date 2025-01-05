import React from "react";
import { useSelector } from "react-redux";

// icons and material-tailwind
import { FaArrowRight } from "react-icons/fa";

// components
import InventoryCardComponent from "./InventoryCardComponent";
import Loader from "../../common/Loader";

const InventoriesSummaryComponent = () => {
  const { inventories, isLoading } = useSelector((state) => state.inventory);
  const { items } = inventories;

  const sortedItems = items
    ? [...items].sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      )
    : [];

  return (
    <div
      id="inventories"
      className="flex flex-col items-center justify-center px-4"
    >
      <div className="text-indigo-600 mb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
          Our Inventories
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Check out our latest inventories
        </p>
      </div>

      <>
        {isLoading ? (
          <Loader />
        ) : items?.length === 0 ? (
          <h4 className="p-3 text-base text-center font-semibold text-red-900">
            Sorry, Inventory is not available for now.
          </h4>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {sortedItems?.slice(0, 8).map((item, i) => (
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
      </>

      {items?.length !== 0 && (
        <div className="my-6">
          <a
            href="/inventory-list"
            className="flex items-center gap-3 mt-3 bg-indigo-600 text-white text-sm px-3 py-2 rounded-lg hover:shadow-lg transition transform hover:scale-105"
          >
            See more
            <FaArrowRight />
          </a>
        </div>
      )}
    </div>
  );
};

export default InventoriesSummaryComponent;
