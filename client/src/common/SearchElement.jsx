import React, { useEffect, useRef, useState } from "react";

// icons and material-tailwind
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

const SearchElement = ({ setSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearch(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearch("");
  };

  const handlePreventEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent default behavior from "Enter" button
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        inputRef.current.focus();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        inputRef.current.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* search button */}
      <form className="flex items-center">
        <label htmlFor="user_search" className="sr-only">
          Search
        </label>
        <div className="relative w-full md:w-[350px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <CiSearch className="text-base text-gray-800" />
          </div>
          <input
            type="text"
            id="user_search"
            className="text-xs bg-gray-50 border border-gray-800 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-gray-600 block w-full pl-9 p-2 placeholder:text-xs placeholder:text-gray-600 placeholder:md:text-sm md:text-sm"
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handlePreventEnter}
            ref={inputRef}
            placeholder="Search or Press [Ctrl + K]"
            autoComplete="off"
          />

          {searchValue && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center m-1 px-1.5 bg-gray-50 text-gray-600 text-lg rounded-full focus:outline-none hover:text-gray-800"
              onClick={handleClearSearch}
            >
              <IoClose />
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default SearchElement;
