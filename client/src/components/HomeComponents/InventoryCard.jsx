import React, { useEffect, useState } from "react";
import InventoryCardModal from "./InventoryCardModal";
import { Chip } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/loanTransaction/loanSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InventoryCard = ({
  itemId,
  image,
  title,
  total_items,
  status,
  serial_number,
  desc,
  categories,
  is_consumable,
}) => {
  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState(total_items);

  const handleOpen = () => setOpen(!open);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (!user && isLoggedOut) {
      toast.error("Please login to add items to your cart.");
      navigate("/");
    } else if (availableItems > 0) {
      dispatch(
        addToCart({
          _id: itemId,
          image,
          title,
          total_items: availableItems,
          status,
          desc,
          categories,
          is_consumable,
        })
      );
      setAvailableItems(availableItems - 1);
    } else {
      toast.error("No items available to add to cart.");
    }
  };

  const itemDetails = {
    image,
    title,
    total_items: availableItems,
    status,
    serial_number,
    desc,
    categories,
    is_consumable,
  };

  const statusColorMap = {
    Available: "green",
    Maintenance: "orange",
    Lost: "red",
    Damaged: "purple",
  };

  const isAddToCartEnabled = status === "Available" && total_items > 0;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <div className="h-64 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
      </div>
      <div className="p-4 flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-sm bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {title}
          </h2>
          <p className="text-xs font-semibold text-purple-900 my-1">
            Total Items:{" "}
            <span className="text-purple-00 bg-purple-100 px-1.5 py-1 rounded-md">
              {availableItems}
            </span>
          </p>

          <div className="w-max mt-1">
            <Chip
              size="sm"
              value={status}
              color={statusColorMap[status] || "gray"}
              variant="outlined"
              className="rounded-full"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full mt-4">
            {categories?.map((category, i) => (
              <div
                key={i}
                className="inline-block px-2 py-1.5 bg-red-400 rounded-lg hover:bg-red-200"
              >
                <p className="text-xs text-white font-base">{category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flew-wrap">
          <button
            className={`text-xs px-4 py-2 rounded-md transition ${
              isAddToCartEnabled
                ? "bg-indigo-500 text-white hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isAddToCartEnabled}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <button
            className="text-xs px-4 py-2 rounded-md transition bg-purple-900 text-white hover:bg-purple-700"
            onClick={handleOpen}
          >
            See Details
          </button>
        </div>
      </div>

      <InventoryCardModal
        open={open}
        handleOpen={handleOpen}
        item={itemDetails}
      />
    </div>
  );
};

export default InventoryCard;
