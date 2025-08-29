import { useState } from "react";

// icons and material-tailwind
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { TbTableImport } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";

// components
import { downloadExcelTemplate } from "../../utils/excelUitls";
import ImportExcelModal from "./ImportExcelModal";

const ExcelImportExportComponent = ({ handleProgressBar, setData }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "absolute top-2/4 -left-5/4 -translate-y-2/4 -translate-x-3/4 font-semibold text-green-900 bg-green-500 text-white p-2 rounded-md w-max",
  };
  return (
    <>
      <div className="md:bottom-8 md:right-8 right-5 bottom-5 z-30 fixed w-full">
        <div className="absolute bottom-0 right-0">
          <SpeedDial>
            <SpeedDialHandler>
              <IconButton size="lg" className="rounded-full bg-green-800">
                <RiFileExcel2Line className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </IconButton>
            </SpeedDialHandler>
            <SpeedDialContent>
              <SpeedDialAction
                className="relative bg-green-600 text-white"
                onClick={() => downloadExcelTemplate(handleProgressBar)}
              >
                <PiMicrosoftExcelLogo className="h-5 w-5" />
                <Typography {...labelProps}>Download Template</Typography>
              </SpeedDialAction>
              <SpeedDialAction className="relative bg-green-600 text-white" onClick={handleOpen}>
                <TbTableImport className="h-5 w-5" />
                <Typography {...labelProps}>Import Inventories</Typography>
              </SpeedDialAction>
            </SpeedDialContent>
          </SpeedDial>
        </div>
      </div>

      <ImportExcelModal open={open} handleOpen={handleOpen} setData={setData} />
    </>
  );
};

export default ExcelImportExportComponent;
