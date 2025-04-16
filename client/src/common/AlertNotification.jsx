import React, { useEffect, useState } from "react";

// icons and material-tailwind
import { GoAlert } from "react-icons/go";

const AlertNotification = ({ message, type }) => {
  const [show, setShow] = useState(true);

  const alertStyles = {
    error: "bg-red-100 text-red-700 border-red-500",
    success: "bg-green-100 text-green-700 border-green-500",
    info: "bg-blue-100 text-blue-700 border-blue-500",
  };

  const currentStyle = alertStyles[type] || alertStyles.error;

  useEffect(() => {
    if (!message) return;

    // Set timeout to hide the notification after 5 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, [message]);

  if (!show || !message) return null;

  return (
    <div
      className={`flex items-center justify-center w-full gap-2 p-2 mb-4 text-xs font-medium border rounded-lg ${currentStyle}`}
      role="alert"
    >
      <GoAlert className="text-xl md:text-base" />
      <span>{message}</span>
    </div>
  );
};

export default AlertNotification;
