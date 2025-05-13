import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import { MdOutlineMeetingRoom } from "react-icons/md";

// components
import LoanDetailByUserComponent from "../../components/DashboardComponents/LoanDetailByUserComponent";
import ConfirmDrawerComponent from "../../components/DashboardComponents/ConfirmDrawerComponent";
import ConfirmDrawerReturnedComponent from "../../components/DashboardComponents/ConfirmDrawerReturnedComponent";
import DialogRequestMeeting from "../../components/DashboardComponents/DialogRequestMeeting";
import DialogMeetingDetailComponent from "../../components/DashboardComponents/DialogMeetingDetailComponent";
import BackButton from "../../common/BackButton";
import Loader from "../../common/Loader";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  confirmReturnedByBorrower,
  getLoanTransactionsByUser,
  loanReset,
  userConfirmReceipt,
} from "../../features/loanTransaction/loanSlice";
import { getMeetingByLoanId } from "../../features/meeting/meetingSlice";

const LoanTransactionByUserPage = () => {
  UseDocumentTitle("Loan Transaction by User");

  const [openBottom, setOpenBottom] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReturned, setOpenReturned] = useState(false);
  const [itemReturned, setItemReturned] = useState(false);
  const [itemReceived, setItemReceived] = useState(false);
  const [openMeetingModal, setOpenMeetingModal] = useState(false);

  const { loanData, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.loan
  );
  const { userInfor } = useSelector((state) => state.user);
  const { meetingInfoByLoanId } = useSelector((state) => state.meeting);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const matchedLoan = loanData?.loanTransactions?.find(
    (loan) => loan._id === id
  );

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleOpenMeetingModal = () => setOpenMeetingModal(true);
  const handleCloseMeetingModal = () => setOpenMeetingModal(false);

  const openDrawerBottom = () => setOpenBottom(true);
  const closeDrawerBottom = () => setOpenBottom(false);

  const openDrawerReturned = () => setOpenReturned(true);
  const closeDrawerReturned = () => setOpenReturned(false);

  const handleUserConfirmReceipt = (e, item_received) => {
    e.preventDefault();
    const data = {
      _id: id,
      item_received: item_received,
    };

    dispatch(userConfirmReceipt(data));

    setOpenBottom(!openBottom);
  };

  const handleConfirmReturned = (e, item_returned) => {
    e.preventDefault();

    const data = {
      _id: id,
      item_returned: item_returned,
    };

    dispatch(confirmReturnedByBorrower(data));

    setOpenReturned(!openReturned);
  };

  useEffect(() => {
    if (loanData?.loanTransactions) {
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
    dispatch(getMeetingByLoanId(id));
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
      <div className="flex w-full flex-col md:flex-row gap-2 justify-between items-center">
        <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 pointer-events-non sm:text-xl ">
          User Loan Transaction Detail Form
        </h3>
        {meetingInfoByLoanId && (
          <button
            className="text-purple-600 hover:text-purple-900 flex gap-1 justify-center items-center bg-purple-50 rounded-md p-2 transition ease-in-out"
            onClick={handleOpenMeetingModal}
          >
            <MdOutlineMeetingRoom className="text-base" />
            <p className="text-xs font-semibold">Meeting Information</p>
          </button>
        )}
      </div>

      <hr className="w-full border-indigo-100 my-4" />

      <LoanDetailByUserComponent
        openDrawerBottom={openDrawerBottom}
        openDrawerReturned={openDrawerReturned}
        meetingInfoByLoanId={meetingInfoByLoanId}
        handleOpenDialog={handleOpenDialog}
        userInfor={userInfor}
      />

      {/* Dialog component for meeting detail */}
      <DialogMeetingDetailComponent
        open={openMeetingModal}
        handleClose={handleCloseMeetingModal}
        meetingData={meetingInfoByLoanId}
        loanData={matchedLoan}
      />

      {/* Dialog component for request meeting */}
      <DialogRequestMeeting
        loanData={loanData}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleOpenDialog={handleOpenDialog}
      />

      {/* Drawer component for confirm the loan item by borrower */}
      <ConfirmDrawerComponent
        openBottom={openBottom}
        closeDrawerBottom={closeDrawerBottom}
        itemReceived={itemReceived}
        setItemReceived={setItemReceived}
        handleConfirm={handleUserConfirmReceipt}
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
