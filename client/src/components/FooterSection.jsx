import React from "react";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";

const LINKS = [
  {
    title: "Product",
    items: ["Overview", "Features", "Solutions", "Tutorials"],
  },
  {
    title: "Company",
    items: ["About us", "Careers", "Press", "News"],
  },
];

const currentYear = new Date().getFullYear();

const FooterSection = () => {
  return (
    <footer className="relative w-full bg-gray-100 py-8">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <Typography variant="h5" className="mb-6">
            InventorCS
          </Typography>
          <div className="grid grid-cols-2 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium opacity-40"
                >
                  {title}
                </Typography>
                {items.map((link) => (
                  <li key={link}>
                    <Typography
                      as="a"
                      href="#"
                      color="gray"
                      className="py-1.5 font-normal transition-colors hover:text-blue-gray-900"
                    >
                      {link}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            &copy; {currentYear} <Link to="/">InventorCS</Link>. All Rights
            Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <IoIosGlobe className="w-5 h-5" />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaInstagram className="w-5 h-5" />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaYoutube className="w-5 h-5" />
            </Typography>
            <Typography
              as="a"
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaGithub className="w-5 h-5" />
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
