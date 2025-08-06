import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import { Chip } from "@material-tailwind/react";
import { BsPatchCheck } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";

// components
import Loader from "../../common/Loader";
import FullScreenImage from "../../common/FullScreenImage";

// features
import { getInventoryById } from "../../features/inventory/inventorySlice";
import { addToCart } from "../../features/loanTransaction/loanSlice";

const InventoryDetailComponent = () => {
  const { id } = useParams();
  const { inventoryById, isLoading } = useSelector((state) => state.inventory);
  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.loan);
  const dispatch = useDispatch();

  const cartItem = cartItems?.find((item) => item._id === id);
  const cartItemQuantity = cartItem ? cartItem.quantity : 0;
  const [availableItems, setAvailableItems] = useState(0);

  useEffect(() => {
    dispatch(getInventoryById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (inventoryById) {
      setAvailableItems(inventoryById.total_items - cartItemQuantity);
    }
  }, [inventoryById, cartItemQuantity]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user && isLoggedOut) {
      toast.error("Please login to add items to your cart.");
    } else if (cartItemQuantity >= 5) {
      toast.error("You cannot add more than 5 of the same item to your cart.");
    } else if (availableItems > 0) {
      dispatch(
        addToCart({
          _id: id,
          image: inventoryById.asset_img || "",
          title: inventoryById.asset_name || "",
          total_items: inventoryById.total_items || "",
          status: inventoryById.item_status || "",
          desc: inventoryById.desc || "",
          categories: inventoryById.categories || "",
          is_consumable: inventoryById.is_consumable || "",
          item_program: inventoryById.item_program || "",
        })
      );
      setAvailableItems(availableItems - 1);
      toast.success("Loan item added, please check the cart icon!", { duration: 4000 });
    } else {
      toast.error("No items available to add to cart.");
    }
  };

  const statusColorMap = {
    Available: "green",
    Maintenance: "orange",
    Lost: "red",
    Damaged: "purple",
    OutOfStock: "gray",
  };

  if (isLoading || !inventoryById) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-start">
      <div className="flex basis-1/2 flex-col gap-4 md:px-2 w-full">
        <FullScreenImage src={inventoryById.asset_img} alt="item-image">
          <img
            src={inventoryById.asset_img}
            alt="item-image"
            className="rounded-lg object-cover object-center h-96 w-full shadow-md shadow-blue-gray-700/20"
          />
        </FullScreenImage>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {inventoryById.asset_name}
          </h2>

          <p className="text-xs text-gray-600 font-medium">
            Serial Number: {inventoryById.serial_number}
          </p>

          <p className="text-xs text-blue-gray-800 font-semibold">
            Is Consumable: {inventoryById.is_consumable ? "Yes" : "No"}
          </p>

          <div className="flex flex-wrap gap-1.5 w-full">
            <div className="inline-block px-3 py-1 border-red-800 border-2 rounded-full">
              <p className="text-xs text-red-700 font-base">#{inventoryById.categories}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col my-2 gap-2">
          <h4 className="text-indigo-700 font-semibold text-sm underline">Description:</h4>
          <p className="text-sm text-gray-700">{inventoryById.desc}</p>
        </div>

        <hr className="my-1 border-blue-gray-200" />

        <div className="flex gap-1 items-center w-full font-semibold text-sm text-gray-900">
          <BsPatchCheck className="font-bold text-sm" />
          <p>{inventoryById.item_program}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="w-max">
            <Chip
              size="sm"
              value={availableItems > 0 ? inventoryById.item_status : "Out of Stock"}
              color={
                availableItems > 0
                  ? statusColorMap[inventoryById.item_status]
                  : statusColorMap["OutOfStock"]
              }
              variant="outlined"
              className="rounded-md"
            />
          </div>

          <p className="text-sm font-semibold text-purple-900 my-2">
            Total Items:{" "}
            <span className="text-purple-00 bg-purple-100 px-1.5 py-1 rounded-md">
              {availableItems}
            </span>
          </p>

          <button
            onClick={handleAddToCart}
            disabled={availableItems <= 0}
            className={`flex w-full md:w-max justify-center items-center gap-1 text-xs px-4 py-3 rounded-md transition border-8 ${
              availableItems > 0
                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaPlus className="text-xs" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailComponent;
