import React, { useEffect, useState } from "react";

// icons and material-tailwind
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { IoIosArrowDown } from "react-icons/io";
import { FaFilter } from "react-icons/fa";

function Icon({ id, open }) {
  return (
    <IoIosArrowDown
      className={`${
        id === open ? "rotate-180" : ""
      } text-base transition-transform`}
    />
  );
}

const ProgramCategoriesComponent = ({ program, setFilterProgram, setPage }) => {
  const [open, setOpen] = useState(0);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedPrograms((prev) => [...prev, value]);
    } else {
      setSelectedPrograms((prev) => prev.filter((item) => item !== value));
    }
    setPage(1);
  };

  useEffect(() => {
    if (selectedPrograms.length === 0) {
      setFilterProgram("");
    } else {
      setFilterProgram(selectedPrograms.join(","));
    }
  }, [selectedPrograms, setFilterProgram]);

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
            Filter By Program{" "}
            <span className="text-xs font-light italic text-red-500">
              (Click to see more)
            </span>
          </div>
        </AccordionHeader>
        <AccordionBody className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-6">
          {program?.map((item) => (
            <div className="flex" key={item}>
              <label htmlFor={item} className="flex cursor-pointer gap-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    id={item}
                    value={item}
                    checked={selectedPrograms.includes(item)}
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

export default ProgramCategoriesComponent;
