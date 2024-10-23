import React from "react";
// import product1 from "../../assets/images/inventory_img.jpg";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import InventoryCard from "./InventoryCard";
import { useSelector } from "react-redux";
import Loader from "../../common/Loader";

const InventoriesSummaryComponent = () => {
  const { inventories, isLoading } = useSelector((state) => state.inventory);
  const { items } = inventories;

  return (
    <div
      id="inventories"
      className="flex flex-col items-center justify-center px-10"
    >
      <div className="text-indigo-600 mb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient ">
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
          <h4 className="p-3 text-lg text-center font-bold text-red-900">
            Sorry, Inventory is not available for now.
          </h4>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:mx-6">
            {items?.slice(0, 8).map((item, i) => (
              <InventoryCard
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
              />
            ))}
          </div>
        )}
      </>

      <div className="my-6">
        <Link
          to="/inventory-list"
          className="flex items-center gap-3 mt-3 bg-indigo-600 text-white text-sm px-3 py-2 rounded-lg hover:shadow-lg transition transform hover:scale-105"
        >
          See more
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default InventoriesSummaryComponent;
