import React, { useState, useEffect } from "react";

// icons and material-tailwind
import { IoFilter } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const FilterCheckBox = ({ filterValues, setFilter, setPage, filterTitle }) => {
  const [selectedValue, setSelectedValue] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedValue((prev) => [...prev, value]);
    } else {
      setSelectedValue((prev) => prev.filter((item) => item !== value));
    }
    setPage(1);
  };

  useEffect(() => {
    if (selectedValue.length === 0) {
      setFilter("");
    } else {
      setFilter(selectedValue.join(","));
    }
  }, [selectedValue, setFilter]);

  return (
    <div className="relative w-full md:max-w-max z-30">
      <div
        className="flex items-center justify-between border-2 border-gray-400 px-3.5 py-2.5 gap-4 rounded-lg cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex gap-2 items-center text-gray-700">
          <IoFilter />
          <span className="text-xs font-semibold">{filterTitle}</span>
        </div>
        <span
          className={`transition-transform ${
            isOpen ? "rotate-180" : ""
          } text-gray-700`}
        >
          <IoIosArrowDown />
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto w-max border border-indigo-300">
          <ul className="p-3 space-y-2">
            {filterValues?.map((filverValue) => (
              <li key={filverValue} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={filverValue}
                  value={filverValue}
                  checked={selectedValue.includes(filverValue)}
                  onChange={handleFilterChange}
                  className="rounded border-gray-300 w-4 h-4"
                />
                <label
                  htmlFor={filverValue}
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {filverValue}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterCheckBox;
