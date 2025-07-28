import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoanTransactionsByUser } from "../../features/loanTransaction/loanSlice";

const UserLoanChartComponent = () => {
  const { loanData } = useSelector((state) => state.loan);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLoanTransactionsByUser());
  }, []);

  return <div>UserLoanChartComponent</div>;
};

export default UserLoanChartComponent;
