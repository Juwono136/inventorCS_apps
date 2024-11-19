import React, { useEffect, useState } from "react";
import BackButton from "../../common/BackButton";
import {
  Card,
  CardBody,
  Chip,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelLoanTransaction,
  confirmReceiveByBorrower,
  confirmReturnedByBorrower,
  getLoanTransactionsByUser,
  loanReset,
} from "../../features/loanTransaction/loanSlice";
import { IoIosArrowDown } from "react-icons/io";
import toast from "react-hot-toast";
import ConfirmDrawerComponent from "../../components/DashboardComponents/ConfirmDrawerComponent";
import { accessToken } from "../../features/token/tokenSlice";
import Loader from "../../common/Loader";
import ConfirmDrawerReturned from "../../components/DashboardComponents/ConfirmDrawerReturned";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import TimelineLoanStatus from "../../components/DashboardComponents/TimelineLoanStatus";

function Icon({ id, open }) {
  return (
    <IoIosArrowDown
      className={`${
        id === open ? "rotate-180" : ""
      } text-base transition-transform`}
    />
  );
}

const LoanTransactionByUser = () => {
  const TABLE_HEAD = ["No", "Item Name", "Quantity", "Is Consumable?"];

  const statusTimeline = [
    "Pending",
    "Ready to Pickup",
    "Borrowed",
    "Partially Consumed",
    "Consumed",
    "Returned",
    "Cancelled",
  ];

  const statusLoanColors = {
    Pending: "blue-gray",
    "Ready to Pickup": "lime",
    Borrowed: "blue",
    "Partially Consumed": "purple",
    Consumed: "orange",
    Returned: "green",
    Cancelled: "red",
  };

  const [open, setOpen] = useState(0);
  const [openBottom, setOpenBottom] = useState(false);
  const [openCancelLoan, setOpenCancelLoan] = useState(false);
  const [openReturned, setOpenReturned] = useState(false);
  const [itemReturned, setItemReturned] = useState(false);
  const [itemReceived, setItemReceived] = useState(false);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const { loanData, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.loan
  );
  const { userInfor } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const { id } = useParams();
  const foundLoan = loanData?.loanTransactions?.find((loan) => loan._id === id);

  const dispatch = useDispatch();

  const openDrawerBottom = () => setOpenBottom(true);
  const closeDrawerBottom = () => setOpenBottom(false);

  const openDrawerReturned = () => setOpenReturned(true);
  const closeDrawerReturned = () => setOpenReturned(false);

  const handleOpenCancelLoan = () => setOpenCancelLoan(!openCancelLoan);

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

  const handleCancelLoan = (e) => {
    e.preventDefault();

    const data = {
      _id: id,
    };

    dispatch(cancelLoanTransaction(data)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenCancelLoan(!openCancelLoan);
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
        Detail Loan Transaction
      </h3>

      <hr className="w-full border-indigo-100 my-4" />

      <Card className="my-3">
        <div className="flex flex-col justify-center items-center w-full gap-2 mb-2">
          <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Loan of Equipment
          </Typography>
          <Typography className="text-xs text-blue-gray-800">
            Transaction ID: {foundLoan?._id}
          </Typography>
        </div>

        <CardBody>
          <div className="grid gap-4 md:m-2">
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Borrower Name
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userInfor?.personal_info?.name}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Personal ID
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userInfor?.personal_info?.binusian_id}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Email
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userInfor?.personal_info?.email}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-blue-800 w-full text-xs">
                  Address
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs ">
                  : {userInfor?.personal_info?.address || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Program
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userInfor?.personal_info?.program || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Phone
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userInfor?.personal_info?.phone || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Borrow Date
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {new Date(foundLoan?.borrow_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Expected Return Date
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  :{" "}
                  {new Date(
                    foundLoan?.expected_return_date
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Purpose of Loan
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {foundLoan?.purpose_of_loan}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Loan Status
                </span>
                <span className="flex gap-2 items-center col-span-2">
                  :{" "}
                  <Chip
                    size="sm"
                    variant="ghost"
                    className="max-w-max "
                    value={foundLoan?.loan_status || ""}
                    color={statusLoanColors[foundLoan?.loan_status]}
                  />
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <Accordion
                open={open === 1}
                icon={<Icon id={1} open={open} />}
                className="w-max"
              >
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="text-sm text-blue-gray-600"
                >
                  <span className="font-semibold text-xs underline text-blue-gray-800 w-full">
                    Loan Status History:
                  </span>
                </AccordionHeader>

                <AccordionBody className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-6">
                  <TimelineLoanStatus
                    loanData={foundLoan}
                    currentStatus={foundLoan?.loan_status}
                    updatedAt={foundLoan?.updatedAt}
                    statusColors={statusLoanColors}
                  />
                </AccordionBody>
              </Accordion>
            </div>
          </div>
          <hr className="border-indigo-100 my-2" />

          <div className="grid gap-2 my-4">
            <span className="font-medium text-xs text-blue-800 w-full">
              Item List:
            </span>
            <Card className="w-full max-h-[250px] overflow-y-auto">
              <table className="w-full table-auto text-left">
                <thead className="sticky top-0">
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-100 p-4"
                      >
                        <Typography className="font-normal leading-none opacity-70 text-sm text-gray-900">
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {foundLoan?.borrowed_item?.map(
                    ({ inventory_id, quantity, is_consumable }, index) => {
                      const { asset_name } = inventory_id;

                      return (
                        <tr key={index}>
                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {index + 1}
                            </Typography>
                          </td>
                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {asset_name}
                            </Typography>
                          </td>

                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {quantity}
                            </Typography>
                          </td>

                          <td className="border-b border-blue-gray-50 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {is_consumable === true ? "Yes" : "No"}
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Button changeloan status */}
          <div className="flex w-full flex-col items-center justify-center text-white mt-8 gap-4">
            {(foundLoan?.loan_status === "Borrowed" ||
              foundLoan?.loan_status === "Partially Consumed" ||
              foundLoan?.loan_status === "Consumed") && (
              <Button
                className="bg-gradient-to-r from-cyan-500 to-lime-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={openDrawerBottom}
                disabled={foundLoan?.borrower_confirmed_date ? true : false}
              >
                Confirm loan items
              </Button>
            )}

            {foundLoan?.loan_status === "Returned" && (
              <Button
                className="bg-gradient-to-r from-lime-500 to-green-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={openDrawerReturned}
                disabled={foundLoan?.return_date ? true : false}
              >
                Confirm loan item has already returned
              </Button>
            )}

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-blue-800">
                Borrower Confirm Date
              </span>
              <span className=" text-blue-900 text-xs">
                :{" "}
                {foundLoan?.borrower_confirmed_date
                  ? new Date(
                      foundLoan?.borrower_confirmed_date
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-green-800">
                Returned Date Confirmation
              </span>
              <span className=" text-green-900 text-xs">
                :{" "}
                {foundLoan?.return_date
                  ? new Date(foundLoan?.return_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            {foundLoan?.loan_status === "Pending" && (
              <Button
                className="bg-gradient-to-r from-red-500 to-red-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenCancelLoan}
              >
                Cancel Loan
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Drawer component for confirm the loan item */}
      <ConfirmDrawerComponent
        openBottom={openBottom}
        closeDrawerBottom={closeDrawerBottom}
        itemReceived={itemReceived}
        setItemReceived={setItemReceived}
        handleConfirm={handleConfirm}
      />

      {/* Drawer componen for confirm returned the loan item */}
      <ConfirmDrawerReturned
        openReturned={openReturned}
        closeDrawerReturned={closeDrawerReturned}
        itemReturned={itemReturned}
        setItemReturned={setItemReturned}
        handleConfirmReturned={handleConfirmReturned}
      />

      {/* Cancel loan transaction dialog component */}
      <DialogOpenComponent
        openDialog={openCancelLoan}
        handleFunc={handleCancelLoan}
        handleOpenDialog={handleOpenCancelLoan}
        message="Are you sure want to cancel this loan transaction?"
        btnText="Yes"
      />
    </div>
  );
};

export default LoanTransactionByUser;
