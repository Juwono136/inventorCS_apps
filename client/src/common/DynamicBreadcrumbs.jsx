import React from "react";
import { useLocation } from "react-router-dom";

// icons and material-tailwind
import { Breadcrumbs } from "@material-tailwind/react";

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const formatBreadcrumbText = (text) =>
    text.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Breadcrumbs fullWidth className="bg-indigo-50 px-4 py-2 rounded-md mb-4">
      <a href="/dashboard" className="text-indigo-500 hover:underline text-xs">
        Dashboard
      </a>

      {pathnames.map((value, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <span key={index} className="text-blue-gray-800 font-medium text-xs">
            {formatBreadcrumbText(value)}
          </span>
        ) : (
          <a
            key={index}
            href={routeTo}
            className="text-indigo-500 hover:underline text-xs"
          >
            {formatBreadcrumbText(value)}
          </a>
        );
      })}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
