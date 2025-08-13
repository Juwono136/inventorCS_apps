import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, formatDistanceToNow, differenceInHours } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

// icons and material-tailwind
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

// components
import Layout from "./Layout";
import Loader from "../../common/Loader";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";
import SearchElement from "../../common/SearchElement";
import FilterByDate from "../../common/FilterByDate";
import Pagination from "../../common/Pagination";

// features
import {
  getNotificationByUser,
  markAllNotiticationAsRead,
  markNotificationAsRead,
} from "../../features/notification/notificationSlice";
import { markTransactionIsNew } from "../../features/loanTransaction/loanSlice";

const UserNotificationsPage = () => {
  UseDocumentTitle("Notifications");

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(currentPage);
  const [search, setSearch] = useState(searchQuery);
  const [debouncedSearch] = useDebounce(search, 500);
  const [notifDateRange, setNotifDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { notifications, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.notification
  );

  const { user } = useSelector((state) => state.auth);

  const formattedStartDate = notifDateRange.startDate
    ? new Date(notifDateRange.startDate).toISOString()
    : "";

  const formattedEndDate = notifDateRange.endDate
    ? new Date(new Date(notifDateRange.endDate).setHours(23, 59, 59, 999)).toISOString()
    : "";

  const handleNotificationClick = (id, loanTransaction) => {
    if (!loanTransaction?._id) return;

    dispatch(markNotificationAsRead(id));
    dispatch(markTransactionIsNew(loanTransaction._id));

    const targetRoute =
      user?.selectedRole === 2
        ? `/user-loan/detail-loan/${loanTransaction._id}`
        : `/user-loan/detail/${loanTransaction._id}`;

    navigate(targetRoute);
  };

  const handleMarkAllNotifAsRead = async (e) => {
    e.preventDefault();
    dispatch(markAllNotiticationAsRead());

    dispatch(
      getNotificationByUser({
        page,
        search: debouncedSearch,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );
  };

  const unreadCount = Array.isArray(notifications?.notifications)
    ? notifications.notifications.filter((n) => !n.is_read).length
    : 0;

  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  // Sync page and search to URL
  useEffect(() => {
    setSearchParams({ page, search });
  }, [page, search]);

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

  // Fetch notifications
  useEffect(() => {
    dispatch(
      getNotificationByUser({
        page,
        search: debouncedSearch,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );
  }, [dispatch, page, debouncedSearch, formattedStartDate, formattedEndDate]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }
  }, [isError, isSuccess, message]);

  const notifList = notifications?.notifications || [];
  const totalPage = notifications?.totalPages || 1;

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <div className="md:mx-8">
        <div className="flex justify-between items-center">
          <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 sm:text-xl">
            Notifications {unreadCount > 0 && `(${displayCount})`}
          </h3>

          <button
            className="text-xs text-gray-800 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
            onClick={handleMarkAllNotifAsRead}
            disabled={isLoading || unreadCount === 0}
          >
            {isLoading ? "Processing..." : "Mark all as read"}
          </button>
        </div>

        <hr className="w-full border-indigo-100 my-4" />

        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
          <SearchElement setSearch={setSearch} />
          <FilterByDate
            dateRange={notifDateRange}
            setDateRange={setNotifDateRange}
            placeholder="Filter by Date"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="flex gap-4 flex-col">
            {Array.isArray(notifList) && notifList.length > 0 ? (
              notifList.map((notif) => (
                <div
                  key={notif._id}
                  className="flex gap-3 rounded-md border border-indigo-200 shadow-sm p-2 hover:bg-blue-gray-50/50 hover:cursor-pointer"
                  onClick={() => handleNotificationClick(notif._id, notif.loan_transaction)}
                >
                  <div className="flex justify-center items-center p-1">
                    <IoAlertCircleOutline className="text-xl md:text-4xl text-red-800 font-semibold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3
                      className={`text-[10px] sm:text-sm lg:text-sm text-gray-800 ${
                        notif.is_read ? "font-normal" : "font-bold"
                      }`}
                    >
                      {notif.message}
                    </h3>
                    <div className="text-[10px] sm:text-xs lg:text-xs flex gap-1 items-center">
                      <FaRegClock className=" text-gray-500" />
                      <p className=" text-gray-500">
                        {differenceInHours(new Date(), new Date(notif.createdAt)) > 24
                          ? format(new Date(notif.createdAt), "dd MMMM yyyy, HH:mm")
                          : formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-4 bg-gray-200 rounded-full">
                <p className="text-sm text-gray-800">No notifications found.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && totalPage > 1 && (
          <Pagination totalPage={totalPage} page={page} setPage={setPage} bgColor="indigo" />
        )}
      </div>
    </Layout>
  );
};

export default UserNotificationsPage;
