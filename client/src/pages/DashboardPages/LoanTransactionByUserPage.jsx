import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// components
import LoanDetailByUserComponent from "../../components/DashboardComponents/LoanDetailByUserComponent";
import ConfirmDrawerComponent from "../../components/DashboardComponents/ConfirmDrawerComponent";
import ConfirmDrawerReturnedComponent from "../../components/DashboardComponents/ConfirmDrawerReturnedComponent";
import BackButton from "../../common/BackButton";
import Loader from "../../common/Loader";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  confirmReceiveByBorrower,
  confirmReturnedByBorrower,
  getLoanTransactionsByUser,
  loanReset,
} from "../../features/loanTransaction/loanSlice";
import { accessToken } from "../../features/token/tokenSlice";

const LoanTransactionByUserPage = () => {
  UseDocumentTitle("Loan Transaction by User");

  const [openBottom, setOpenBottom] = useState(false);
  const [openReturned, setOpenReturned] = useState(false);
  const [itemReturned, setItemReturned] = useState(false);
  const [itemReceived, setItemReceived] = useState(false);

  const { loanData, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.loan
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const openDrawerBottom = () => setOpenBottom(true);
  const closeDrawerBottom = () => setOpenBottom(false);

  const openDrawerReturned = () => setOpenReturned(true);
  const closeDrawerReturned = () => setOpenReturned(false);

  const handleConfirm = (e, item_received) => {
    e.preventDefault();
    const data = {
      _id: id,
      item_received: item_received,
    };

    dispatch(confirmReceiveByBorrower(data)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenBottom(!openBottom);
  };

  const handleConfirmReturned = (e, item_returned) => {
    e.preventDefault();

    const data = {
      _id: id,
      item_returned: item_returned,
    };

    dispatch(confirmReturnedByBorrower(data)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenReturned(!openReturned);
  };

  useEffect(() => {
    if (loanData?.loanTransactions) {
      const matchedLoan = loanData.loanTransactions.find(
        (loan) => loan._id === id
      );

      if (!matchedLoan) {
        toast.error("Transaction not found");
        navigate("/404", { replace: true });
      }
    }
  }, [loanData, id, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && loanData?.message) {
      toast.success(loanData.message);
      dispatch(loanReset());
    }
    dispatch(loanReset());
    dispatch(getLoanTransactionsByUser());
  }, [isError, isSuccess, message]);

  if (isLoading || !loanData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden m-4 md:m-8">
      <div className="flex items-center">
        <BackButton link="/user-loan" />
      </div>

      <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 pointer-events-non sm:text-xl ">
        Loan Transaction Detail
      </h3>

      <hr className="w-full border-indigo-100 my-4" />

      <LoanDetailByUserComponent
        openDrawerBottom={openDrawerBottom}
        openDrawerReturned={openDrawerReturned}
      />

      {/* Drawer component for confirm the loan item */}
      <ConfirmDrawerComponent
        openBottom={openBottom}
        closeDrawerBottom={closeDrawerBottom}
        itemReceived={itemReceived}
        setItemReceived={setItemReceived}
        handleConfirm={handleConfirm}
      />

      {/* Drawer componen for confirm returned the loan item */}
      <ConfirmDrawerReturnedComponent
        openReturned={openReturned}
        closeDrawerReturned={closeDrawerReturned}
        itemReturned={itemReturned}
        setItemReturned={setItemReturned}
        handleConfirmReturned={handleConfirmReturned}
      />
    </div>
  );
};

export default LoanTransactionByUserPage;
