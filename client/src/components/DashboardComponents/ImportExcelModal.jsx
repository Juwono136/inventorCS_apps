import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

// icons and material-tailwind
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Progress,
} from "@material-tailwind/react";

// features
import { importFromExcel } from "../../utils/excelUitls";

const ImportExcelModal = ({ open, handleOpen, setData }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an Excel file to upload!");
      return;
    }
    setProgress(20);
    await importFromExcel(file, setProgress, setData, dispatch);
    handleOpen();
    setFile(null);
  };

  return (
    <Dialog open={open} size="sm">
      <DialogHeader className="flex w-full justify-center text-base md:text-xl text-green-800">
        Import Inventories Data
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col items-center gap-4">
          <label
            htmlFor="excel-file"
            className="border-2 border-dashed border-green-400 p-6 w-full text-sm text-green-500 text-center cursor-pointer rounded-sm hover:bg-gray-100 hover:font-semibold"
          >
            {file ? file.name : "Click to Select an Excel File"}
            <input
              type="file"
              id="excel-file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {progress > 0 && <Progress value={progress} color="green" />}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button color="green" onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ImportExcelModal;
