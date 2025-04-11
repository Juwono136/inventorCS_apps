import React from "react";

// icons and material-tailwind
import {
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

// components
import { getFullDay } from "../../common/Date";

const statusMeetingColors = {
  "Need Approval": "orange",
  Approved: "green",
  "Meeting Cancelled": "red",
};

const DialogMeetingDetailComponent = ({
  open,
  handleClose,
  meetingData,
  loanData,
}) => {
  return (
    <Dialog open={open} size="md" className="overflow-hidden bg-gray-50">
      <DialogHeader className="flex justify-between items-center px-5">
        <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient text-lg">
          Meeting Information
        </h1>
        <IconButton variant="text" onClick={handleClose}>
          <IoClose className="h-6 w-6 text-gray-800" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="pt-0 px-5">
        <div className="mb-2 text-xs text-gray-600 italic">
          <span>Request created at {getFullDay(meetingData?.createdAt)}</span>
        </div>
        <div className="space-y-2 p-4 text-sm text-blue-gray-700 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-md">
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs md:text-sm text-gray-800 w-full font-semibold">
                Meeting Status
              </span>
              <span className="flex gap-2 items-center col-span-2">
                :{" "}
                <Chip
                  size="sm"
                  variant="ghost"
                  className="max-w-max"
                  value={meetingData?.status || ""}
                  color={statusMeetingColors[meetingData?.status]}
                />
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs md:text-sm text-gray-800 w-full font-semibold">
                Meeting Date
              </span>
              <span className="col-span-2 text-gray-900 text-xs md:text-sm">
                : {getFullDay(meetingData?.meeting_date)}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs md:text-sm text-gray-800 w-full font-semibold">
                Meeting Time
              </span>
              <span className="col-span-2 text-gray-900 text-xs md:text-sm">
                : {meetingData?.meeting_time}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs md:text-sm text-gray-800 w-full font-semibold">
                Meeting Location
              </span>
              <span className="col-span-2 text-gray-900 text-xs md:text-sm">
                : {meetingData?.location}
              </span>
            </div>
          </div>

          {loanData?.loan_status === "Cancelled" && (
            <div className="space-y-2 text-sm pt-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-xs md:text-sm text-red-800 underline italic w-full font-semibold">
                  Cancelation Reason
                </span>
                <span className="col-span-2 text-red-900 text-xs md:text-sm">
                  : {loanData?.cancelation_reason}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default DialogMeetingDetailComponent;
