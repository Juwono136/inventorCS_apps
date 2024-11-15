import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  DialogBody,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import {
  createLoanTransaction,
  removeFromCart,
  updateCartItemQuantity,
} from "../../features/loanTransaction/loanSlice";
import Loader from "../../common/Loader";
import { accessToken } from "../../features/token/tokenSlice";

const MyCart = () => {
  const TABLE_HEAD = ["No", "Item Info", "Quantity", "Is Consumable?"];

  const initialState = {
    purpose_of_loan: "",
    borrow_date: "",
    expected_return_date: "",
  };

  const [data, setData] = useState(initialState);

  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const { userInfor } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.loan.cartItems);
  const { loanData, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.loan
  );

  const { purpose_of_loan, borrow_date, expected_return_date } = data;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
      isError: "",
      isSuccess: "",
    });
  };

  const handleUpdateQuantity = (itemId, quantity, totalItems) => {
    if (quantity > totalItems) {
      toast.error("Sorry, Quantity exceeds available items.");
    } else if (quantity <= 0) {
      // Remove item from cart if quantity is less than or equal to 0
      dispatch(removeFromCart(itemId));
    } else {
      // Update item quantity
      dispatch(updateCartItemQuantity({ _id: itemId, quantity }));
    }
  };

  const handleCreateLoan = (e) => {
    e.preventDefault();

    const borrowedItemData = cartItems.map((item) => ({
      inventory_id: item._id,
      quantity: item.quantity,
    }));

    const loanData = {
      borrowed_item: borrowedItemData,
      ...data,
    };

    dispatch(createLoanTransaction(loanData)).then((res) => {
      dispatch(accessToken(res));
    });
  };

  useEffect(() => {
    if (!user && isLoggedOut) {
      toast.error("Please login to borrow the item.");
    }

    if (isError) {
      toast.error(message);
    }

    if (cartItems.length === 0) {
      navigate("/");
    }

    if (isSuccess) {
      toast.success(loanData.message);
      navigate("/user-loan");
    }
  }, [user, isLoggedOut, isError, isSuccess, message, loanData]);

  if (!user && isLoggedOut) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="m-6">
      <div className="flex flex-col justify-center items-center w-full gap-2 mb-2">
        <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
          Loan of Equipment
        </Typography>
        <Typography className="text-sm text-blue-gray-800">
          Item borrowing information
        </Typography>
      </div>

      <DialogBody divider>
        <div className="grid gap-4 md:m-2">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-xs text-blue-800 w-full">
                Borrower Name
              </span>
              <span className="col-span-2 font-semibold text-gray-900 text-xs">
                : {userInfor.personal_info?.name}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-xs text-blue-800 w-full">
                Personal ID
              </span>
              <span className="col-span-2 font-semibold text-gray-900 text-xs">
                : {userInfor.personal_info?.binusian_id}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-xs text-blue-800 w-full">
                Email
              </span>
              <span className="col-span-2 font-semibold text-gray-900 text-xs">
                : {userInfor.personal_info?.email}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-blue-800 w-full text-xs">
                Home Address
              </span>
              <span className="col-span-2 font-semibold text-gray-900 text-xs ">
                : {userInfor.personal_info?.address || "-"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-xs text-blue-800 w-full">
                Program
              </span>
              <span className="col-span-2 font-semibold text-gray-900 text-xs">
                : {userInfor.personal_info?.program || "-"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-xs text-blue-800 w-full">
                Phone
              </span>
              <span className="col-span-2 font-semibold text-gray-900 text-xs">
                : {userInfor.personal_info?.phone || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex w-full flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col w-full">
              <label
                htmlFor="borrow_date"
                className="text-gray-800  font-semibold lg:text-sm text-xs"
              >
                Borrow Date:
              </label>
              <input
                type="date"
                id="borrow_date"
                name="borrow_date"
                value={borrow_date}
                onChange={handleChange}
                className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="return_date"
                className="text-gray-800 font-semibold lg:text-sm text-xs"
              >
                Expected Return Date:
              </label>
              <input
                type="date"
                id="expected_return_date"
                name="expected_return_date"
                value={expected_return_date}
                onChange={handleChange}
                className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mb-0">
            <label
              htmlFor="purpose_of_loan"
              className="text-gray-800 font-semibold lg:text-sm text-xs"
            >
              Purpose of Loan:
            </label>
            <textarea
              maxLength={500}
              name="purpose_of_loan"
              id="purpose_of_loan"
              cols="30"
              rows="4"
              className="p-3 rounded-md outline-none text-xs w-full text-blue-gray-900 bg-indigo-300/30 placeholder:text-gray-700 sm:text-sm resize-none"
              value={purpose_of_loan}
              placeholder="Write the Purpose of loan here..."
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col gap-2 my-4 overflow-y-auto">
          <h1 className="text-sm font-semibold text-blue-900">
            Borrowed items:
          </h1>
          <table className="min-w-max md:w-full table-auto text-left ">
            <thead className="sticky top-0 bg-blue-gray-50">
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className={`cursor-pointer border-y border-blue-gray-100 bg-purple-100/50 text-blue-gray-900 p-4 transition-colors ${
                      head !== "No." ? "hover:bg-purple-50" : ""
                    }`}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cartItems?.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <h4 className="p-3 text-sm text-red-800 font-medium">
                      Item not found.
                    </h4>
                  </td>
                </tr>
              )}

              {cartItems?.map(
                (
                  { image, title, quantity, _id, is_consumable, total_items },
                  index
                ) => {
                  const isLast = index === cartItems.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index} className="hover:bg-gray-200">
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {index + 1}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={image} alt={title} size="sm" />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {title}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <IconButton
                            color="purple"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                _id,
                                quantity - 1,
                                total_items
                              )
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
                              handleUpdateQuantity(
                                _id,
                                quantity + 1,
                                total_items
                              )
                            } // Increase quantity
                          >
                            +
                          </IconButton>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {is_consumable === true ? "Yes" : "No"}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        <div className="flex w-full items-center justify-center md:justify-end text-white mt-8">
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-800 text-sm py-2 px-8 rounded-lg capitalize"
            onClick={handleCreateLoan}
          >
            Checkout
          </Button>
        </div>
      </DialogBody>
    </Card>
  );
};

export default MyCart;
