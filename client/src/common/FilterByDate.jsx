import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

const FilterByDate = ({ dateRange, setDateRange, placeholder }) => {
  return (
    <div className="w-full md:w-auto z-20">
      <Datepicker
        inputClassName="py-2.5 px-4 rounded-md border-gray-400 border-2 text-xs font-bold w-full md:w-auto text-blue-gray-900 placeholder:text-gray-600"
        toggleClassName="absolute rounded-r-lg text-gray-600 right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        separator="-"
        placeholder={placeholder}
        displayFormat={"DD-MM-YYYY"}
        primaryColor={"indigo"}
        readOnly={true}
        value={dateRange}
        onChange={(date) => setDateRange(date)}
      />
    </div>
  );
};

export default FilterByDate;
