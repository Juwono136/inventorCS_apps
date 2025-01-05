import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

// components
import Layout from "./Layout";
import Loader from "../../common/Loader";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import {
  getNotificationByUser,
  markAllNotiticationAsRead,
  markNotificationAsRead,
} from "../../features/notification/notificationSlice";

const UserNotificationsPage = () => {
  UseDocumentTitle("Notifications");

  const { notification, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.notification.notifications
  );

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNotificationClick = (id, loanId) => {
    dispatch(markNotificationAsRead(id));

    if (user.selectedRole === 2) {
      navigate(`/user-loan/detail-loan/${loanId}`);
    } else {
      navigate(`/user-loan/detail/${loanId}`);
    }
  };

  const handleMarkAllNotifAsRead = async (e) => {
    e.preventDefault();
    dispatch(markAllNotiticationAsRead());

    dispatch(getNotificationByUser());
  };

  const unreadCount = Array.isArray(notification)
    ? notification.filter((notif) => !notif.is_read).length
    : 0;

  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(message);
    }
  }, [isError, isSuccess, message]);

  useEffect(() => {
    dispatch(getNotificationByUser());
  }, []);

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <div className="md:mx-8">
        <div className="flex justify-between items-center">
          <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 pointer-events-non sm:text-xl ">
            Notifications {unreadCount > 0 && `(${displayCount})`}
          </h3>

          <button
            className="text-xs text-gray-800 font-semibold hover:underline"
            onClick={handleMarkAllNotifAsRead}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Mark all as read"}
          </button>
        </div>

        <hr className="w-full border-indigo-100 my-4" />

        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex gap-2 flex-col p-2">
            {Array.isArray(notification) && notification?.length > 0 ? (
              notification?.map((notif) => (
                <div
                  className="flex gap-4 rounded-md shadow-md p-4 hover:bg-blue-gray-100/50 hover:cursor-pointer"
                  key={notif._id}
                  onClick={() =>
                    handleNotificationClick(
                      notif._id,
                      notif.loan_transaction._id
                    )
                  }
                >
                  <div className="flex justify-center items-center p-1">
                    <IoAlertCircleOutline className="text-xl md:text-4xl text-red-800 font-semibold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3
                      className={`text-xs md:text-sm text-gray-800 ${
                        notif.is_read ? "font-normal" : "font-bold"
                      }`}
                    >
                      {notif.message}
                    </h3>
                    <div className="flex gap-2 items-center">
                      <FaRegClock className="text-xs text-gray-700" />
                      <p className="text-xs text-gray-700">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-2 bg-gray-300 rounded-full">
                <p className="text-sm">There is no notification.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserNotificationsPage;
