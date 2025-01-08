import React from "react";
import { QRCode } from "react-qrcode-logo";

// icons and material-tailwind
import { FaTimes } from "react-icons/fa";

const FullScreenQRCode = ({ isOpen, onClose, qrValue, transactionId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs md:max-w-md lg:max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-indigo-800">
            Scan the loan transaction
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="flex flex-col justify-center items-center p-4">
          <QRCode
            value={qrValue}
            size={200}
            logoWidth={32}
            eyeRadius={8}
            eyeColor="#161D6F"
            fgColor="#161D6F"
            qrStyle="dots"
          />
          <p className="text-[10px] md:text-sm text-gray-600 font-semibold mt-1">
            {transactionId}
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 italic">
            Point your camera to scan the QR Code
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenQRCode;
