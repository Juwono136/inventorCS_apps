import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import {
  createLoanTransaction,
  loanReset,
  removeFromCart,
  updateCartItemQuantity,
} from "../../features/loanTransaction/loanSlice";
import Loader from "../../common/Loader";
import { accessToken } from "../../features/token/tokenSlice";
import TransactionCartComponent from "../../components/HomeComponents/TransactionCartComponent";
import EmptyCartComponent from "../../components/HomeComponents/EmptyCartComponent";
import InventoryCardComponent from "../../components/HomeComponents/InventoryCardComponent";
import FooterComponent from "../../components/HomeComponents/FooterComponent";
import ScrollUp from "../../common/ScrollUp";

const MyCartPage = () => {
  const initialState = {
    purpose_of_loan: "",
    borrow_date: { startDate: null, endDate: null },
    expected_return_date: { startDate: null, endDate: null },
  };

  const [data, setData] = useState(initialState);

  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const { userInfor } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.loan.cartItems);
  const { loanData, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.loan
  );
  const { inventories } = useSelector((state) => state.inventory);
  const { items } = inventories;

  // console.log(cartItems);

  const { purpose_of_loan, borrow_date, expected_return_date } = data;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (name, value) => {
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
      toast.success("Item removed from loan transaction");
    } else if (quantity > 5) {
      toast.error("Sorry, The quantity for each item cannot exceed 5.");
    } else {
      // Update item quantity
      dispatch(updateCartItemQuantity({ _id: itemId, quantity }));
    }
  };

  const handleRevomeCartItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from loan transaction");
  };

  const handleCreateLoan = (e) => {
    e.preventDefault();

    const borrowedItemData = cartItems.map((item) => ({
      inventory_id: item._id,
      quantity: item.quantity,
    }));

    const loanData = {
      borrowed_item: borrowedItemData,
      purpose_of_loan,
      borrow_date: borrow_date.startDate,
      expected_return_date: expected_return_date.startDate,
    };

    dispatch(createLoanTransaction(loanData)).then((res) => {
      dispatch(accessToken(res));
    });
  };

  useEffect(() => {
    if (!user && isLoggedOut) {
      navigate("/404");
      toast.error("Invalid Credentials.");
    }

    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(loanData.message);
      localStorage.removeItem("cartItems");
      navigate("/user-loan");
    }
    dispatch(loanReset());
  }, [user, isLoggedOut, isError, isSuccess, message, loanData, dispatch]);

  if (!user && isLoggedOut) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return <Loader />;
  }

  const sortedItems = items
    ? [...items].sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      )
    : [];

  return (
    <div className="m-4">
      <div className="mb-12 mt-4">
        {cartItems?.length === 0 ? (
          // empty cart component
          <EmptyCartComponent />
        ) : (
          <TransactionCartComponent
            userInfor={userInfor}
            cartItems={cartItems}
            handleChange={handleChange}
            handleCreateLoan={handleCreateLoan}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRevomeCartItem={handleRevomeCartItem}
            borrow_date={borrow_date}
            expected_return_date={expected_return_date}
            purpose_of_loan={purpose_of_loan}
          />
        )}
      </div>

      <div className="mt-24">
        {isLoading ? (
          <Loader />
        ) : items?.length === 0 ? (
          <h4 className="p-3 text-base text-center font-semibold text-red-900">
            Sorry, Inventory is not available for now.
          </h4>
        ) : (
          <div className="flex flex-col m-3 md:mx-3">
            <div className="my-4 w-full">
              <h2 className="text-xl md:text-2xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Latest inventory
              </h2>
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

export default MyCartPage;
