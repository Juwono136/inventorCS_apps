import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalPage, page, setPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNextPage = () => {
    if (page === totalPage) return;
    const newPage = page + 1;
    setPage(newPage);
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handlePrevPage = () => {
    if (page === 1) return;
    const newPage = page - 1;
    setPage(newPage);
    setSearchParams({ ...searchParams, page: newPage });
  };

  const visiblePages = Array.from(
    { length: Math.min(totalPage + 1, totalPage) },
    (_, i) => Math.max(1, page - 2) + i
  ).filter((num) => num <= totalPage);

  const handlePageChange = (num) => {
    setPage(num);
    setSearchParams({ ...searchParams, page: num });
  };

  return (
    <div className="flex items-center justify-center mt-3 mb-8">
      <Button
        variant="text"
        color="blue"
        className="flex items-center gap-1 px-2 capitalize"
        onClick={handlePrevPage}
        disabled={page === 1}
      >
        Prev
      </Button>

      {/* Tombol Navigasi Halaman Numerik */}
      <div className="flex items-center gap-2">
        {visiblePages.map((num) => (
          <IconButton
            key={num}
            variant={num === page ? "filled" : "text"}
            onClick={() => handlePageChange(num)}
            color="blue"
          >
            {num}
          </IconButton>
        ))}
      </div>

      <Button
        variant="text"
        color="blue"
        className="flex items-center gap-1 px-2 capitalize"
        onClick={handleNextPage}
        disabled={page === totalPage}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
