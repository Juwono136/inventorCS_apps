import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-tailwindcss-datepicker";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// icons and material-tailwind
import { Dialog } from "@material-tailwind/react";

// components
import Loader from "../../common/Loader";
import AlertNotification from "../../common/AlertNotification";

// features
import {
  createMeeting,
  getMeetingByLoanId,
  meetingReset,
} from "../../features/meeting/meetingSlice";

const DialogRequestMeeting = ({
  loanData,
  openDialog,
  setOpenDialog,
  handleOpenDialog,
}) => {
  const timeOptions = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const locationOptions = ["Binus JWC Campus", "Binus FX Campus"];

  const initialState = {
    location: "",
    meeting_date: { startDate: null },
    meeting_time: "",
  };

  const [data, setData] = useState(initialState);

  const { id } = useParams();

  const { meeting, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.meeting
  );

  const foundLoan = loanData?.loanTransactions?.find((loan) => loan._id === id);
  // console.log(foundLoan);

  const { location, meeting_date, meeting_time } = data;

  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value,
      isError: "",
      isSuccess: "",
    });
  };

  const handleTimeChange = (time) => {
    setData({
      ...data,
      meeting_time: time,
    });
  };

  const handleCreateMeeting = (e) => {
    e.preventDefault();

    const meetingData = {
      meeting_date: meeting_date.startDate,
      meeting_time,
      location,
    };

    dispatch(createMeeting({ meetingData, loanId: id }));

    if (isSuccess) {
      setOpenDialog(!openDialog);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(meeting.message);
      dispatch(meetingReset());
      dispatch(getMeetingByLoanId(id));
      setOpenDialog(!openDialog);
    }
  }, [meeting, isError, isSuccess, message]);

  return (
    <Dialog
      open={openDialog}
      size="sm"
      className="border-2 border-transparent bg-gradient-to-r from-red-500 to-orange-500"
    >
      {isLoading ? (
        <div className="flex justify-center items-center flex-col rounded-lg bg-white p-6 shadow-2xl">
          <Loader />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col rounded-lg bg-white p-6 shadow-2xl">
          <h2 className="flex items-center justify-center text-lg font-semibold text-gray-800">
            Meeting Request Form
          </h2>

          <p className="text-[10px] md:text-xs font-semibold text-indigo-500 mt-1">
            {foundLoan?.transaction_id}
          </p>

          <hr className="w-full border-indigo-100 my-3" />

          {/* Display error message */}
          {isError && <AlertNotification message={message} type="error" />}

          <div className="flex w-full flex-col gap-4">
            <span className="text-[10px] text-red-600 italic font-semibold">
              *) Make sure you choose a meeting date on a weekday (Monday -
              Friday).
            </span>

            {/* Meeting Location */}
            <div className="flex flex-col w-full gap-1">
              <label
                htmlFor="location"
                className="text-gray-900 lg:text-sm text-xs font-medium"
              >
                Location:
              </label>
              <select
                id="location"
                className="p-3 rounded-md outline-none text-xs w-full text-blue-gray-900 bg-indigo-300/30 placeholder:text-gray-600"
                value={data.location}
                onChange={(e) => handleChange("location", e.target.value)}
              >
                <option value="" disabled>
                  Select a location
                </option>
                {locationOptions.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting Date */}
            <div className="flex flex-col w-full gap-1">
              <label
                htmlFor="meeting_date"
                className="text-gray-900 lg:text-sm text-xs font-medium"
              >
                Meeting Date:
              </label>
              <DatePicker
                asSingle={true}
                useRange={false}
                readOnly={true}
                primaryColor={"indigo"}
                inputClassName="p-3 rounded-md outline-none text-xs w-full text-blue-gray-900 bg-indigo-300/30 placeholder:text-gray-600"
                toggleClassName="absolute rounded-r-lg text-gray-600 right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                value={data.meeting_date}
                displayFormat={"DD-MM-YYYY"}
                minDate={new Date()}
                onChange={(newValue) => handleChange("meeting_date", newValue)}
              />
            </div>

            {/* Meeting Time */}
            <div className="flex flex-col w-full gap-1">
              {/* Time Picker */}
              <label className="text-sm font-medium text-gray-900 block">
                Meeting Time:
              </label>
              <ul id="timetable" className="grid w-full grid-cols-3 gap-2 mb-5">
                {timeOptions.map((time, index) => (
                  <li key={index}>
                    <input
                      type="radio"
                      id={`time-${index}`}
                      value={time}
                      name="timetable"
                      className="hidden peer"
                      onChange={() => handleTimeChange(time)}
                    />
                    <label
                      htmlFor={`time-${index}`}
                      className="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center hover:text-gray-900 bg-white border rounded-lg cursor-pointer text-gray-500 border-gray-200 peer-checked:border-indigo-700 peer-checked:bg-blue-50 peer-checked:text-indigo-700 hover:bg-gray-50 "
                    >
                      {time}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              className="rounded-md bg-orange-700 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-orange-800"
              onClick={handleCreateMeeting}
            >
              Create
            </button>

            <button
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-300"
              onClick={handleOpenDialog}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default DialogRequestMeeting;
