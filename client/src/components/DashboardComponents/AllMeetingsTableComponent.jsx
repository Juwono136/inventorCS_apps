import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

// icons and material-tailwind
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
} from "@material-tailwind/react";
import { RxCaretSort } from "react-icons/rx";

// components
import Loader from "../../common/Loader";
import { getFullDay } from "../../common/Date";
import SearchElement from "../../common/SearchElement";
import FilterCheckBox from "../../common/FilterCheckBox";
import FilterByDate from "../../common/FilterByDate";
import Pagination from "../../common/Pagination";

// features
import { getAllMeetings } from "../../features/meeting/meetingSlice";

const AllMeetingsTableComponent = ({ refreshTrigger }) => {
  const TABLE_HEAD = [
    "No.",
    "Loan Transaction ID",
    "Meeting Date",
    "Meeting Time",
    "Location",
    "Meeting Status",
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const [sortMeeting, setSortMeeting] = useState({
    sort: "meeting_date",
    order: "desc",
  });
  const [search, setSearch] = useState("");
  const [meetingStatus, setMeetingStatus] = useState("");
  const [page, setPage] = useState(1);
  const [meetingDateRange, setMeetingDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const dispatch = useDispatch();
  const [debouncedSearch] = useDebounce(search, 500);

  const { meeting, isLoading, isError, message } = useSelector(
    (state) => state.meeting
  );
  const data = meeting;

  const formattedStartDate = meetingDateRange.startDate
    ? new Date(meetingDateRange.startDate).toISOString()
    : "";

  const formattedEndDate = meetingDateRange.endDate
    ? new Date(
        new Date(meetingDateRange.endDate).setHours(23, 59, 59, 999)
      ).toISOString()
    : "";

  // Sets the page when the component is first mounted to match the URL.
  useEffect(() => {
    setPage(currentPage);
  }, []);

  // Sync search with URL
  useEffect(() => {
    if (searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  // Reset page to 1 when search changes
  useEffect(() => {
    if (debouncedSearch) {
      setPage(1);
      setSearchParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (page === currentPage) {
      dispatch(
        getAllMeetings({
          page,
          sort: sortMeeting,
          meetingStatus,
          search: debouncedSearch || "",
          meeting_date_start: formattedStartDate,
          meeting_date_end: formattedEndDate,
        })
      );
    }
  }, [
    dispatch,
    page,
    currentPage,
    sortMeeting,
    meetingStatus,
    debouncedSearch,
    formattedStartDate,
    formattedEndDate,
    refreshTrigger,
  ]);

  // Make sure the URL is always updated with the state
  useEffect(() => {
    setSearchParams({
      page,
      search,
      meetingStatus,
    });

    if (isError) {
      toast.error(message);
    }

    // if (isSuccess) {
    //   toast.success(message);
    // }
  }, [page, search, meetingStatus, isError, message]);

  const handleSort = (column) => {
    const sortFileMap = {
      "Loan Transaction ID": "loanTransaction_info.transaction_id",
      "Meeting Date": "meeting_date",
      "Meeting Time": "meeting_time",
      Location: "location",
      "Meeting Status": "meeting_status",
    };
    const selectedSortField = sortFileMap[column];
    if (selectedSortField) {
      const newOrder =
        sortMeeting.sort === selectedSortField && sortMeeting.order === "asc"
          ? "desc"
          : "asc";
      setSortMeeting({ sort: selectedSortField, order: newOrder });
    }
  };

  return (
    <>
      <Card className="w-full overflow-y-hidden">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div>
            <Typography className="text-orange-900 text-sm font-semibold md:text-xl">
              Recent Meeting Requests
            </Typography>
            <Typography
              color="gray"
              className="mt-1 font-normal text-xs md:text-sm"
            >
              Overview of all meeting requests related to loan transactions
            </Typography>
          </div>
        </CardHeader>

        <div className="mb-4 flex flex-col gap-4 py-2 px-4 md:flex-row md:items-center">
          <SearchElement setSearch={setSearch} />

          <FilterCheckBox
            filterValues={data?.statuses || []}
            setFilter={(val) => {
              setMeetingStatus(val);
            }}
            setPage={setPage}
            filterTitle="Filter by Meeting Status"
          />

          <FilterByDate
            dateRange={meetingDateRange}
            setDateRange={setMeetingDateRange}
            placeholder="Filter by Meeting Date"
          />
        </div>

        <CardBody className="h-[400px] overflow-y-auto p-0">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : data?.meetings?.length > 0 ? (
            <table className="w-full table-auto text-left">
              <thead className="sticky top-0">
                <tr>
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className={`cursor-pointer border-y border-orange-100 bg-orange-100 p-4 transition-colors ease-in-out ${
                        head !== "No." ? "hover:bg-orange-200" : ""
                      }`}
                      onClick={() => head !== "No." && handleSort(head)}
                    >
                      <Typography
                        color="blue-gray"
                        className="flex items-center justify-between gap-1 font-bold text-xs md:text-sm text-gray-800 leading-none opacity-80"
                      >
                        {head}{" "}
                        {head !== "No." && index !== TABLE_HEAD.length && (
                          <RxCaretSort className="text-xl hover:text-indigo-200" />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.meetings?.map(
                  (
                    {
                      _id,
                      loanTransaction_info,
                      meeting_date,
                      meeting_time,
                      location,
                      status,
                    },
                    index
                  ) => {
                    const isLast = index === data.meetings.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    const statusMeetingColors = {
                      "Need Approval": "orange",
                      Approved: "green",
                      "Meeting Cancelled": "red",
                    };

                    return (
                      <tr key={_id} className="hover:bg-amber-50">
                        <td className={classes}>
                          <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                            {index + 1}
                          </h1>
                        </td>

                        <td className={classes}>
                          <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                            <a
                              href={`user-loan/detail-loan/${loanTransaction_info._id}`}
                              target="_blank"
                              className="hover:underline hover:text-orange-900"
                            >
                              {loanTransaction_info.transaction_id}
                            </a>
                          </h1>
                        </td>

                        <td className={classes}>
                          <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                            {getFullDay(meeting_date)}
                          </h1>
                        </td>

                        <td className={classes}>
                          <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                            {meeting_time}
                          </h1>
                        </td>

                        <td className={classes}>
                          <h1 className="font-normal text-blue-gray-800 text-xs md:text-sm">
                            {location}
                          </h1>
                        </td>

                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={status}
                              color={statusMeetingColors[status]}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center item-center text-xs md:text-sm text-center text-red-800 my-4 mx-8 bg-red-100 rounded-md md:rounded-full px-4 py-2">
              Meeting request not found.
            </div>
          )}
        </CardBody>

        {data?.totalMeetings > 0 && (
          <Pagination
            totalPage={
              search
                ? Math.ceil(data?.totalMeetings / data?.limit)
                : data?.totalPages
            }
            page={page}
            setPage={setPage}
            bgColor="orange"
          />
        )}
      </Card>
    </>
  );
};

export default AllMeetingsTableComponent;
