import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <IoIosArrowDown
      className={`${
        id === open ? "rotate-180" : ""
      } text-base transition-transform`}
    />
  );
}

const ItemCategories = ({ categories, setFilterCategories, setPage }) => {
  const [open, setOpen] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((item) => item !== value));
    }
    setPage(1);
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilterCategories("");
    } else {
      setFilterCategories(selectedCategories.join(","));
    }
  }, [selectedCategories, setFilterCategories]);

  return (
    <>
      <Accordion
        open={open === 1}
        icon={<Icon id={1} open={open} />}
        className="w-full"
      >
        <AccordionHeader
          onClick={() => handleOpen(1)}
          className="text-sm text-indigo-500"
        >
          <div className="flex gap-1 justify-center items-center">
            <FaFilter />
            Filter By Category{" "}
          </div>
        </AccordionHeader>
        <AccordionBody className="flex flex-col md:flex-wrap gap-2 md:gap-6">
          {categories?.map((item) => (
            <div className="flex" key={item}>
              <label htmlFor={item} className="flex cursor-pointer gap-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    id={item}
                    value={item}
                    checked={selectedCategories.includes(item)}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <strong className="font-medium text-gray-800">{item}</strong>
                </div>
              </label>
            </div>
          ))}
        </AccordionBody>
      </Accordion>
      <hr className="w-full border-indigo-100" />
    </>
  );
};

export default ItemCategories;