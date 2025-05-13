import React, { useState } from "react";
import DatePicker from "react-tailwindcss-datepicker";

// icons and material-tailwind
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { BsPatchCheck } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";

const TransactionCartComponent = ({
  cartItems,
  handleChange,
  handleCreateLoan,
  handleUpdateQuantity,
  handleRevomeCartItem,
  purpose_of_loan,
}) => {
  const characterLimit = 500;

  const [borrowDate, setBorrowDate] = useState({ startDate: null });
  const [expectedReturnDate, setExpectedReturnDate] = useState({
    startDate: null,
  });

  const handleBorrowDateChange = (date) => {
    setBorrowDate(date);
    handleChange("borrow_date", date);
  };

  const handleExpectedReturnDateChange = (date) => {
    setExpectedReturnDate(date);
    handleChange("expected_return_date", date);
  };

  return (
    <div className="m-2 p-4 shadow-lg">
      <h2 className="text-xl md:text-2xl mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
        My Cart
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex basis-3/4 flex-col gap-2">
          {cartItems?.map(
            (
              {
                _id,
                title,
                item_program,
                image,
                total_items,
                quantity,
                is_consumable,
              },
              index
            ) => (
              <div
                className="relative flex flex-col md:flex-row gap-4 p-4 rounded-md border-2 border-gray-300"
                key={index}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-all"
                  onClick={() => handleRevomeCartItem(_id)}
                >
                  <FaRegTrashCan className="text-xl" />
                </button>

                <img
                  src={image}
                  alt="item-image"
                  className="rounded-lg object-cover object-center h-32 w-32 shadow-md shadow-blue-gray-700/20"
                />

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 pb-2">
                    <BsPatchCheck className="font-bold text-sm text-purple-900" />
                    <h2 className="font-semibold text-xs bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                      {item_program}
                    </h2>
                  </div>

                  <a href={`/item_detail/${_id}`} className="w-full lg:w-max">
                    <h2 className="text-base text-indigo-900 hover:underline">
                      {title}
                    </h2>
                  </a>
                  <p className="text-xs font-semibold text-purple-900">
                    Item left:{" "}
                    <span className="text-purple-00 bg-purple-100 px-1.5 py-1 rounded-md">
                      {total_items - quantity}
                    </span>
                  </p>

                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-gray-600 text-xs">
                      Is Consumable: {is_consumable ? "Yes" : "No"}
                    </p>
                    <p className="text-gray-700 text-xs">Quantity:</p>
                    <div className="flex items-center gap-2">
                      <IconButton
                        color="purple"
                        size="sm"
                        disabled={quantity === 1}
                        onClick={() =>
                          handleUpdateQuantity(_id, quantity - 1, total_items)
                        } // Decrease quantity
                      >
                        -
                      </IconButton>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {quantity}
                      </Typography>
                      <IconButton
                        color="purple"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(_id, quantity + 1, total_items)
                        } // Increase quantity
                      >
                        +
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex basis-1/4 flex-col gap-4">
          <div className="flex flex-col w-full">
            <label
              htmlFor="borrow_date"
              className="text-gray-800  font-semibold lg:text-sm text-xs"
            >
              Borrow Date:
            </label>
            <DatePicker
              asSingle={true}
              useRange={false}
              readOnly={true}
              primaryColor={"indigo"}
              inputClassName="p-3 rounded-md outline-none text-xs w-full text-blue-gray-900 bg-indigo-300/30 placeholder:text-gray-600"
              toggleClassName="absolute rounded-r-lg text-gray-600 right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              value={borrowDate}
              displayFormat={"DD-MM-YYYY"}
              minDate={new Date()}
              onChange={handleBorrowDateChange}
            />
          </div>

          <div
            className={`flex flex-col w-full ${
              borrowDate.startDate ? "" : "hidden"
            }`}
          >
            <label
              htmlFor="return_date"
              className="text-gray-800 font-semibold lg:text-sm text-xs"
            >
              Expected Return Date:
            </label>
            <DatePicker
              asSingle={true}
              useRange={false}
              readOnly={true}
              primaryColor={"indigo"}
              inputClassName="p-3 rounded-md outline-none text-xs w-full text-blue-gray-900 bg-indigo-300/30 placeholder:text-gray-600"
              toggleClassName="absolute rounded-r-lg text-gray-600 right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              value={expectedReturnDate}
              displayFormat={"DD-MM-YYYY"}
              minDate={borrowDate.startDate || new Date()}
              onChange={handleExpectedReturnDateChange}
            />
          </div>

          <div className="mb-0">
            <label
              htmlFor="purpose_of_loan"
              className="text-gray-800 font-semibold lg:text-sm text-xs"
            >
              Purpose of Loan:
            </label>
            <textarea
              maxLength={characterLimit}
              name="purpose_of_loan"
              id="purpose_of_loan"
              cols="30"
              rows="8"
              className="p-3 rounded-md outline-none text-xs w-full text-blue-gray-900 bg-indigo-300/30 placeholder:text-gray-600 sm:text-sm resize-none"
              value={purpose_of_loan}
              placeholder="Write the Purpose of loan here..."
              onChange={(e) => handleChange("purpose_of_loan", e.target.value)}
            ></textarea>

            <p className="mb-1 text-gray-600 text-xs text-right">
              {characterLimit - purpose_of_loan.length}/{characterLimit}{" "}
              characters left
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-800 text-sm py-2 px-8 rounded-lg capitalize"
            onClick={handleCreateLoan}
          >
            Checkout (
            {cartItems.reduce((total, item) => total + item.quantity, 0)})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCartComponent;
