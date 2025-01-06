import React from "react";

// icons and material-tailwind
import EmptyCartIcon from "../../assets/images/empty-cart.png";

const EmptyCartComponent = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 bg-indigo-300/10 p-6 mx-2 rounded-md shadow-md">
        <div className="flex justify-center items-center">
          <img
            src={EmptyCartIcon}
            alt="empty-cart"
            className="w-1/2 md:w-max"
          />
        </div>
        <div className="flex flex-col justify-center items-center md:items-start gap-2">
          <h1 className="text-xl">Ups, your cart is empty</h1>
          <p className="text-sm text-gray-800 text-center md:text-left">
            Let's fill it up with items from our inventory!
          </p>

          <a
            href="/inventory-list"
            className="w-max flex justify-center items-center px-6 py-3 bg-indigo-500 rounded-md text-xs font-semibold text-white hover:bg-indigo-700 transition-all"
          >
            Start Borrowing
          </a>
        </div>
      </div>
    </>
  );
};

export default EmptyCartComponent;
