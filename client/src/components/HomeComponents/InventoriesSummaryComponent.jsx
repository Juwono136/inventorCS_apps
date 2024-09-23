import React from "react";
import product1 from "../../assets/images/inventory_img.jpg";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import InventoryCard from "./InventoryCard";
import { itemList } from "../../utils/InventoryData";
import { useCart } from "../InventoryComponents/CartContext";

const InventoriesSummaryComponent = () => {
  const { addToCart } = useCart();
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
          Check out our latest inventory
        </p>
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

      <div className="my-6">
        <Link
          to="/inventory"
          className="flex items-center gap-3 mt-3 bg-indigo-600 text-white text-sm p-3 rounded-md hover:shadow-lg transition transform hover:scale-105"
        >
          See more
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default InventoriesSummaryComponent;
