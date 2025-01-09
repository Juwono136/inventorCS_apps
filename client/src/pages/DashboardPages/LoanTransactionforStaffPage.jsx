import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// components
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import Loader from "../../common/Loader";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  getLoanTransactionById,
  loanReset,
  updateStatusToBorrowed,
  updateStatusToReadyToPickup,
  updateStatusToReturned,
} from "../../features/loanTransaction/loanSlice";
import { accessToken } from "../../features/token/tokenSlice";
import { getUserById } from "../../features/user/userSlice";
import LoanDetailforStaffComponent from "../../components/DashboardComponents/LoanDetailforStaffComponent";
import BackButton from "../../common/BackButton";

const LoanTransactionDetailPage = () => {
  UseDocumentTitle("Loan Transaction detail");

  const [openDialog, setOpenDialog] = useState(false);

  const { loanData, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.loan
  );

  const { id } = useParams();
  const dispatch = useDispatch();

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleStatustoReadyToPickup = (e) => {
    e.preventDefault();

    const data = {
      _id: id,
    };

    dispatch(updateStatusToReadyToPickup(data)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenDialog(!openDialog);
  };

  const handleStatusToBorrowed = (e) => {
    e.preventDefault();

    const data = {
      _id: id,
    };

    dispatch(updateStatusToBorrowed(data)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenDialog(!openDialog);
  };

  const handleStatusToReturned = (e) => {
    e.preventDefault();

    const data = {
      _id: id,
    };

    dispatch(updateStatusToReturned(data)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(loanData.message);
    }

    dispatch(loanReset());
  }, [loanData, isError, isSuccess, message]);

  useEffect(() => {
    dispatch(getLoanTransactionById(id));

    if (loanData?.borrower_id) {
      dispatch(getUserById(loanData.borrower_id));
    }
  }, [dispatch, id, loanData?.borrower_id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden m-4 md:m-8">
      <div className="flex items-center">
        <BackButton link="/borrowed-item" />
      </div>

      <h3 className="text-base font-bold text-indigo-500/60 pointer-events-non sm:text-xl ">
        Detail Loan Transaction
      </h3>

      <hr className="w-full border-indigo-100 my-4" />

      {/* loan user info */}
      <LoanDetailforStaffComponent handleOpenDialog={handleOpenDialog} />

      {/* Change loan status to borrowed open dialog */}
      <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={
          loanData?.loan_status === "Pending"
            ? handleStatustoReadyToPickup
            : loanData?.loan_status === "Ready to Pickup"
            ? handleStatusToBorrowed
            : loanData?.loan_status === "Borrowed" ||
              loanData?.loan_status === "Partially Consumed"
            ? handleStatusToReturned
            : null
        }
        handleOpenDialog={handleOpenDialog}
        message="Are you sure want to change the loan status?"
        btnText="Yes"
      />
    </div>
  );
};

export default LoanTransactionDetailPage;
