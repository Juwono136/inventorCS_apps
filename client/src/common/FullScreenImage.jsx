import React, { useState } from "react";

// icons and material-tailwind
import { IoClose } from "react-icons/io5";
import { MdOutlineZoomOutMap } from "react-icons/md";

const FullScreenImage = ({ src, alt, className, children }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openFullScreen = () => setIsFullScreen(true);
  const closeFullScreen = () => setIsFullScreen(false);

  return (
    <>
      <div
        className={`relative group cursor-pointer ${className}`}
        onClick={openFullScreen}
      >
        {/* Display children or image */}
        {children ? (
          children
        ) : (
          <img src={src} alt={alt} className="rounded-lg object-cover" />
        )}

        {/* Hover icon at the top-right corner */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black bg-opacity-50 text-white p-1 rounded-md flex items-center justify-center">
            <MdOutlineZoomOutMap size={20} />
          </div>
        </div>
      </div>

      {/* Full screen mode */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative flex justify-center items-center w-full h-full">
            {/* Responsive image */}
            <img
              src={src}
              alt={alt}
              className="w-full h-auto max-h-screen rounded-lg object-contain"
            />

            {/* Close button */}
            <button
              onClick={closeFullScreen}
              className="absolute top-0 right-0 bg-white text-black p-2 rounded-full font-bold text-sm hover:bg-gray-200 shadow-md"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FullScreenImage;
