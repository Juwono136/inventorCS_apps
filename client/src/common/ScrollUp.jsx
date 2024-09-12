import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 450) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <a
        href="#"
        className={`fixed right-4 bottom-4 p-3 bg-indigo-600 text-white rounded-md transition-all ${
          isVisible ? "opacity-100" : "opacity-0"
        } hover:bg-indigo-800`}
      >
        <FaArrowUp className="text-base" />
      </a>
    </>
  );
};

export default ScrollUp;
