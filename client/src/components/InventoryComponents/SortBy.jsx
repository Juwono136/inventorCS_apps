import React from "react";

const SortBy = ({ sort, setSort }) => {
  const sortOptions = ["Name", "Total Items"];

  const handleChange = (event) => {
    const selectedOption = event.target.value;
    setSort(selectedOption);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="sort" className="mr-2 text-sm font-medium">
        Sort By:
      </label>
      <select
        id="sort"
        value={sort.sort === "asset_name" ? "Name" : "Total Items"}
        onChange={handleChange}
        className="border rounded p-2"
      >
        {sortOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortBy;
