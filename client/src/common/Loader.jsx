import React from "react";

// icons and material-tailwind
import { Spinner } from "@material-tailwind/react";

const Loader = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Spinner className="h-16 w-16 text-indigo-900/50" />
    </div>
  );
};

export default Loader;
