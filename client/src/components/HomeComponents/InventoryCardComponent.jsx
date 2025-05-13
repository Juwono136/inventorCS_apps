import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// icons and material-tailwind
import { Chip } from "@material-tailwind/react";
import { BsPatchCheck } from "react-icons/bs";

// components
import Loader from "../../common/Loader";

const InventoryCardComponent = ({
  itemId,
  image,
  title,
  total_items,
  status,
  categories,
  is_consumable,
  item_program,
}) => {
  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const { cartItems, isLoading } = useSelector((state) => state.loan);
  const cartItem = cartItems?.find((item) => item._id === itemId);
  const cartItemQuantity = cartItem ? cartItem.quantity : 0;
  const [availableItems, setAvailableItems] = useState(
    total_items - cartItemQuantity
  );

  const statusColorMap = {
    Available: "green",
    Maintenance: "orange",
    Lost: "red",
    Damaged: "purple",
    OutOfStock: "gray",
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <a
      className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
      href={`/item_detail/${itemId}`}
    >
      <div className="h-40 md:h-64 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col">
          <h2 className="font-semibold text-sm bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {title}
          </h2>
          <p className="text-xs font-semibold text-purple-900 my-2">
            Total Items:{" "}
            <span className="text-purple-00 bg-purple-100 px-1.5 py-1 rounded-md">
              {availableItems}
            </span>
          </p>

          <p className="text-xs text-blue-gray-700 my-1">
            Is Consumable: {is_consumable ? "Yes" : "No"}
          </p>

          <div className="flex gap-1 items-center w-full my-2 font-semibold text-[0.6rem] md:text-xs text-gray-900">
            <BsPatchCheck className="font-bold text-sm" />
            <p>{item_program}</p>
          </div>

          <div className="w-max mt-1">
            <Chip
              size="sm"
              value={availableItems > 0 ? status : "Out of Stock"}
              color={
                availableItems > 0
                  ? statusColorMap[status]
                  : statusColorMap["OutOfStock"]
              }
              variant="outlined"
              className="rounded-md"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full mt-2">
            {categories?.map((category, i) => (
              <div
                key={i}
                className="inline-block px-3 py-1 border-red-800 border-2 rounded-full"
              >
                <p className="text-xs text-red-700 font-base">#{category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="flex">
          <button
            className={`flex w-full justify-center items-center gap-1 text-xs px-4 py-2 rounded-md transition ${
              isAddToCartEnabled
                ? "border-8 bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isAddToCartEnabled}
            onClick={handleAddToCart}
          >
            <FaPlus className="text-xs" />
            Add to Cart
          </button>
        </div> */}
      </div>

      {/* <InventoryCardModal
        open={open}
        handleOpen={handleOpen}
        item={itemDetails}
      /> */}
    </a>
  );
};

export default InventoryCardComponent;
