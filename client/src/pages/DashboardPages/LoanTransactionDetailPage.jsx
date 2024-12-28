import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getLoanTransactionById,
  loanReset,
  updateStatusToBorrowed,
  updateStatusToReadyToPickup,
  updateStatusToReturned,
} from "../../features/loanTransaction/loanSlice";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import toast from "react-hot-toast";
import { accessToken } from "../../features/token/tokenSlice";
import Loader from "../../common/Loader";
import { getUserById } from "../../features/user/userSlice";
import { IoIosArrowDown } from "react-icons/io";
import TimelineLoanStatusComponent from "../../components/DashboardComponents/TimelineLoanStatusComponent";

function Icon({ id, open }) {
  return (
    <IoIosArrowDown
      className={`${
        id === open ? "rotate-180" : ""
      } text-base transition-transform`}
    />
  );
}

const LoanTransactionDetailPage = () => {
  const TABLE_HEAD = ["No", "Item Name", "Quantity", "Is Consumable?"];

  const { loanData, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.loan
  );
  const { userById } = useSelector((state) => state.user);

  const statusLoanColors = {
    Pending: "blue-gray",
    "Ready to Pickup": "lime",
    Borrowed: "blue",
    "Partially Consumed": "purple",
    Consumed: "orange",
    Returned: "green",
    Cancelled: "red",
  };

  const [openDialog, setOpenDialog] = useState(false);

  const [open, setOpen] = useState(0);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const { id } = useParams();
  // console.log(foundLoan);

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
      <h3 className="text-base text-center font-bold text-indigo-500/60 pointer-events-non sm:text-xl ">
        Detail Loan Transaction
      </h3>

      <hr className="w-full border-indigo-100 my-4" />

      <Card className="my-3">
        <div className="flex flex-col justify-center items-center w-full gap-2 mb-2">
          <Typography className="font-semibold text-xl bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            Loan of Equipment
          </Typography>
          <Typography className="text-xs text-blue-gray-800">
            Transaction ID: {loanData?._id}
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
                  : {userById?.personal_info?.name}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Personal ID
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userById?.personal_info?.binusian_id}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Email
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userById?.personal_info?.email}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-blue-800 w-full text-xs">
                  Address
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs ">
                  : {userById?.personal_info?.address || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Program
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userById?.personal_info?.program || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Phone
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {userById?.personal_info?.phone || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium text-xs text-blue-800 w-full">
                  Borrow Date
                </span>
                <span className="col-span-2 font-semibold text-gray-900 text-xs">
                  : {new Date(loanData?.borrow_date).toLocaleDateString()}
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
                    loanData?.expected_return_date
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
                  : {loanData?.purpose_of_loan}
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
                    value={loanData?.loan_status || ""}
                    color={statusLoanColors[loanData?.loan_status]}
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
                  <TimelineLoanStatusComponent
                    loanData={loanData}
                    currentStatus={loanData?.loan_status}
                    updatedAt={loanData?.updatedAt}
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
            <Card className="w-full max-h-[400px] overflow-y-auto">
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
                  {loanData?.borrowed_item?.map(
                    ({ inventory_id, quantity, is_consumable }, index) => {
                      const { asset_name } = inventory_id;

                      return (
                        <tr key={index}>
                          <td className="border-b border-blue-gray-50 p-4">
                            <p className="font-normal text-xs text-blue-gray-800">
                              {index + 1}
                            </p>
                          </td>
                          <td className="border-b border-blue-gray-50 p-4">
                            <p className="font-normal text-xs text-blue-gray-800">
                              {asset_name}
                            </p>
                          </td>

                          <td className="border-b border-blue-gray-50 p-4">
                            <p className="font-normal text-xs text-blue-gray-800">
                              {quantity}
                            </p>
                          </td>

                          <td className="border-b border-blue-gray-50 p-4">
                            <p className="font-normal text-xs text-blue-gray-800">
                              {is_consumable === true ? "Yes" : "No"}
                            </p>
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
            {loanData?.loan_status === "Pending" && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Change status to Ready to Pickup
              </Button>
            )}

            {loanData?.loan_status === "Ready to Pickup" && (
              <Button
                className="bg-gradient-to-r from-red-500 to-orange-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Change status to Borrowed
              </Button>
            )}

            {(loanData?.loan_status === "Borrowed" ||
              loanData?.loan_status === "Partially Consumed") && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-green-800 text-xs py-3 px-6 rounded-lg capitalize"
                onClick={handleOpenDialog}
              >
                Change status to Returned
              </Button>
            )}

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-blue-800">
                Borrower Confirm Date
              </span>
              <span className=" text-blue-900 text-xs">
                :{" "}
                {loanData?.borrower_confirmed_date
                  ? new Date(
                      loanData?.borrower_confirmed_date
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </div>

            <div className="flex w-full justify-center items-center">
              <span className=" text-xs text-green-800">
                Return Date Confirmation
              </span>
              <span className=" text-green-900 text-xs">
                :{" "}
                {loanData?.return_date
                  ? new Date(loanData?.return_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

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
        message="Are you sure want to change the status?"
        btnText="Yes"
      />
    </div>
  );
};

export default LoanTransactionDetailPage;
