import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import { MdOutlineMeetingRoom } from "react-icons/md";

// components
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import LoanDetailforStaffComponent from "../../components/DashboardComponents/LoanDetailforStaffComponent";
import DialogMeetingDetailComponent from "../../components/DashboardComponents/DialogMeetingDetailComponent";
import DialogHandoverChecklist from "../../components/DashboardComponents/DialogHandoverChecklist";
import DialogStaffConfirmReturn from "../../components/DashboardComponents/DialogStaffConfirmReturn";
import Loader from "../../common/Loader";
import UseDocumentTitle from "../../common/UseDocumentTitle";
import BackButton from "../../common/BackButton";

// features
import {
  getLoanTransactionById,
  loanReset,
  staffConfirmHandover,
  staffConfirmReturn,
  updateStatusToReadyToPickup,
} from "../../features/loanTransaction/loanSlice";
import { accessToken } from "../../features/token/tokenSlice";
import { getUserById } from "../../features/user/userSlice";
import { approveMeeting, getMeetingByLoanId } from "../../features/meeting/meetingSlice";

const LoanTransactionforStaffPage = () => {
  UseDocumentTitle("Loan Transaction detail");

  const [openDialog, setOpenDialog] = useState(false);
  const [openMeetingModal, setOpenMeetingModal] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isSConfirmReturnModalOpen, setIsConfirmReturnModalOpen] = useState(false);

  const { loanData, isError, isSuccess, message, isLoading } = useSelector((state) => state.loan);
  const { meetingInfoByLoanId } = useSelector((state) => state.meeting);

  const { id } = useParams();
  const dispatch = useDispatch();

  const handleOpenMeetingModal = () => setOpenMeetingModal(true);
  const handleCloseMeetingModal = () => setOpenMeetingModal(false);

  const handleOpenHandoverModal = () => setIsHandoverModalOpen(true);
  const handleCloseHandoverModal = () => setIsHandoverModalOpen(false);

  const handleOpenConfirmReturnModal = () => setIsConfirmReturnModalOpen(true);
  const handleCloseConfirmReturnModal = () => setIsConfirmReturnModalOpen(false);

  const handleOpenDialog = (type = "loan") => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setDialogType("");
    setOpenDialog(false);
  };

  const handleStatustoReadyToPickup = (e) => {
    e.preventDefault();

    const data = {
      _id: id,
    };

    dispatch(updateStatusToReadyToPickup(data)).then((res) => {
      dispatch(accessToken(res));
    });

    handleCloseDialog();
  };

  const handleApproveMeeting = (e) => {
    e.preventDefault();
    const data = {
      _id: meetingInfoByLoanId._id,
    };

    dispatch(approveMeeting(data))
      .unwrap()
      .then(() => {
        dispatch(getMeetingByLoanId(id)); // refresh data meeting
        toast.success("Meeting approved successfully");
      });

    handleCloseDialog();
  };

  const handleConfirmHandoverSubmit = (loanId, checkedItemIds) => {
    const handoverData = {
      loanId,
      checkedItemIds,
    };

    dispatch(staffConfirmHandover(handoverData))
      .unwrap()
      .then(() => {
        dispatch(getMeetingByLoanId(id)); // refresh data meeting
        toast.success("Handover confirmed successfully");
        handleCloseHandoverModal();
      });
  };

  const handleConfirmReturnSubmit = (loanId, checkedReturnedItemIds, loan_note) => {
    const data = {
      loanId,
      checkedReturnedItemIds,
      loan_note,
    };

    dispatch(staffConfirmReturn(data))
      .unwrap()
      .then(() => {
        toast.success("Successfully confirmed the return of the loan item.");
        handleCloseConfirmReturnModal();
      });
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && loanData?.message) {
      toast.success(loanData?.message);
      dispatch(loanReset());
    }
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

      <div className="flex w-full flex-col md:flex-row gap-2 justify-between items-center">
        <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 pointer-events-non sm:text-xl ">
          Loan Transaction Detail
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

      {/* loan user info */}
      <LoanDetailforStaffComponent
        handleOpenDialog={() => handleOpenDialog("loan")}
        handleOpenMeetingDialog={() => handleOpenDialog("meeting")}
        handleOpenHandoverModal={handleOpenHandoverModal}
        handleOpenConfirmReturnModal={handleOpenConfirmReturnModal}
      />

      {/* Change loan status to borrowed open dialog */}
      <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={
          dialogType === "loan"
            ? loanData?.loan_status === "Pending"
              ? handleStatustoReadyToPickup
              : null
            : dialogType === "meeting"
            ? handleApproveMeeting
            : null
        }
        handleOpenDialog={handleCloseDialog}
        message={
          dialogType === "meeting"
            ? "Approve this meeting request?"
            : "Are you sure want to change the loan status?"
        }
        btnText="Yes"
      />

      {/* Dialog handover checklist */}
      <DialogHandoverChecklist
        open={isHandoverModalOpen}
        handleClose={handleCloseHandoverModal}
        handleConfirm={handleConfirmHandoverSubmit}
        loanData={loanData}
        isError={isError}
        message={message}
      />

      {/* Dialog staff confirm return  */}
      <DialogStaffConfirmReturn
        open={isSConfirmReturnModalOpen}
        handleClose={handleCloseConfirmReturnModal}
        handleConfirm={handleConfirmReturnSubmit}
        loanData={loanData}
        isError={isError}
        message={message}
      />

      {/* Dialog component for meeting detail */}
      <DialogMeetingDetailComponent
        open={openMeetingModal}
        handleClose={handleCloseMeetingModal}
        meetingData={meetingInfoByLoanId}
        loanData={loanData}
      />
    </div>
  );
};

export default LoanTransactionforStaffPage;
