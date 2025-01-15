import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// components
import Layout from "./Layout";
import BorrowedtemTableComponent from "../../components/DashboardComponents/BorrowedtemTableComponent";
import MoreInfoBorrowedItemComponent from "../../components/DashboardComponents/MoreInfoBorrowedItemComponent";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  getAllLoanTransactions,
  markTransactionIsNew,
} from "../../features/loanTransaction/loanSlice";
import { getAllUsersInfor } from "../../features/user/userSlice";

const BorrowedItemsPage = () => {
  UseDocumentTitle("Borrowed Item");

  const { loanData, isLoading } = useSelector((state) => state.loan);
  const { allUsersInfor } = useSelector((state) => state.user);
  const { users } = allUsersInfor;
  const data = loanData;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const dispatch = useDispatch();

  const handleOpenDialog = (id) => {
    const selectedData = data?.loanTransactions?.find(
      (item) => item._id === id
    );

    const borrower = getBorrowerInfo(selectedData.borrower_id);

    const itemDetails = {
      ...selectedData,
      id: selectedData?._id,
      transactionId: selectedData?.transaction_id,
      ...borrower,
    };

    if (selectedData?.is_new === true) {
      dispatch(markTransactionIsNew(id));
      dispatch(getAllLoanTransactions());
    }

    setSelectedItem(itemDetails);

    setOpenDialog(!openDialog);
  };

  const getBorrowerInfo = (borrowerId) => {
    const borrower = users?.find((user) => user._id === borrowerId);
    return borrower || {};
  };

  useEffect(() => {
    dispatch(getAllLoanTransactions());
    dispatch(getAllUsersInfor({ all: true }));
  }, [dispatch]);

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl mb-2 md:mb-0">
        Borrowed Items List
      </h3>
      <hr className="my-2 border-blue-gray-50" />

      <div className="mt-2">
        <BorrowedtemTableComponent
          isLoading={isLoading}
          handleOpenDialog={handleOpenDialog}
          getBorrowerInfo={getBorrowerInfo}
          data={data}
        />
      </div>

      {/* Open Dialog More Info */}
      <MoreInfoBorrowedItemComponent
        open={openDialog}
        handleOpenDialog={() => setOpenDialog(false)}
        selectedItem={selectedItem}
      />
    </Layout>
  );
};

export default BorrowedItemsPage;
