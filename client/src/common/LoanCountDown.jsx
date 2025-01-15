import React from "react";
import Countdown from "react-countdown";

// Main Component
const LoanCountDown = ({ expiryDate, txtError, txtRender }) => {
  // Countdown Renderer Function
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-red-100/20 border border-red-800">
          <p className="text-red-800">{txtError}</p>
        </div>
      );
    } else {
      return (
        <div className="font-semibold text-xs w-full text-center px-3 py-2 rounded-lg bg-green-100/20 border border-green-800">
          <p className="text-gray-600">{txtRender}</p>
          <p className="text-green-600 mt-1">
            {days}d {hours}h {minutes}m {seconds}s
          </p>
        </div>
      );
    }
  };

  return <Countdown date={expiryDate} renderer={countdownRenderer} />;
};

export default LoanCountDown;
