import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { useSearchParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ totalPage, page, setPage, bgColor }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visiblePageCount, setVisiblePageCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setVisiblePageCount(8); // Desktop
      } else if (width >= 640) {
        setVisiblePageCount(5); // Tablet
      } else {
        setVisiblePageCount(3); // Mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextPage = () => {
    if (page === totalPage || page === 10) return;
    const newPage = page + 1;
    setPage(newPage);
    setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    const newPage = page - 1;
    setPage(newPage);
    setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
  };

  const startPage = Math.max(1, page - Math.floor(visiblePageCount / 2));
  const endPage = Math.min(totalPage, startPage + visiblePageCount - 1);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handlePageChange = (num) => {
    setPage(num);
    setSearchParams({ ...Object.fromEntries(searchParams), page: num });
  };

  const pageLimitMessage = page === 10 && (
    <div className="text-center text-xs text-indigo-600 mb-8">
      <p>
        If you can't find the data you're looking for, please search for the
        data using specific keywords!
      </p>
    </div>
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-3 mb-2 gap-2">
        <Button
          variant="text"
          color={bgColor}
          className="flex items-center gap-1 px-2 capitalize bg-blue-gray-100/20"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <IoIosArrowBack />
          Prev
        </Button>

        {/* Tombol Navigasi Halaman Numerik */}
        <div className="flex items-center gap-1">
          {visiblePages.map((num) => (
            <IconButton
              key={num}
              variant={num === page ? "filled" : "text"}
              onClick={() => handlePageChange(num)}
              color={bgColor}
            >
              {num}
            </IconButton>
          ))}
        </div>

        <Button
          variant="text"
          color={bgColor}
          className="flex items-center gap-1 px-2 capitalize bg-blue-gray-100/20"
          onClick={handleNextPage}
          disabled={page === totalPage || page === 10}
        >
          Next
          <IoIosArrowForward />
        </Button>
      </div>

      {pageLimitMessage}
    </>
  );
};

export default Pagination;
