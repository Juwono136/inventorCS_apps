import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  Chip,
} from "@material-tailwind/react";
import { FaDotCircle } from "react-icons/fa";
import { format } from "date-fns";

const TimelineLoanStatus = ({
  loanData,
  currentStatus,
  updatedAt,
  statusColors,
}) => {
  let relevantStatuses = ["Pending", "Ready to Pickup"];

  const allConsumable = loanData?.borrowed_item?.every(
    (item) => item.is_consumable
  );
  const partiallyConsumable = loanData?.borrowed_item?.some(
    (item) => item.is_consumable
  );

  if (loanData?.loan_status === "Cancelled") {
    relevantStatuses.push("Cancelled");
  } else if (allConsumable) {
    relevantStatuses.push("Consumed");
  } else if (partiallyConsumable) {
    relevantStatuses.push("Partially Consumed", "Returned");
  } else {
    relevantStatuses.push("Borrowed", "Returned");
  }

  return (
    <>
      <Timeline className=" max-w-max">
        {relevantStatuses.map((status, index) => (
          <TimelineItem key={index} className="h-20 max-w-max">
            {status !== "Returned" &&
              status !== "Cancelled" &&
              status !== "Consumed" && (
                <TimelineConnector className="!w-[50px]" />
              )}
            <TimelineHeader className="relative items-center gap-2 rounded-xl border border-blue-gray-100 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
              <TimelineIcon
                className={`p-0.5 ${
                  status === currentStatus
                    ? "animate-pulse bg-indigo-300"
                    : "bg-blue-gray-500"
                }`}
              >
                <FaDotCircle className="text-indigo-500" />
              </TimelineIcon>
              <Chip
                size="sm"
                variant="ghost"
                className={`max-w-max m-0 ${
                  status === currentStatus ? "animate-pulse" : ""
                }`}
                value={status || ""}
                color={statusColors[status]}
              />

              <p className="text-blue-gray-500 text-[10px] md:text-xs">
                {currentStatus === status
                  ? `${format(new Date(updatedAt), "dd MMM yyyy, HH:mm")}`
                  : ""}
              </p>
            </TimelineHeader>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
};

export default TimelineLoanStatus;
