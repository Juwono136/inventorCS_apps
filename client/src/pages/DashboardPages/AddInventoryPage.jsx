import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import { Button } from "@material-tailwind/react";
import { IoCloudUploadOutline } from "react-icons/io5";

// components
import Loader from "../../common/Loader";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

// features
import { convertFileToBase64 } from "../../utils/convertToBase64";
import {
  createInventory,
  inventoryReset,
} from "../../features/inventory/inventorySlice";
import { accessToken } from "../../features/token/tokenSlice";

const AddInventoryPage = () => {
  UseDocumentTitle("Add Inventory");

  const characterLimit = 500;

  // const statusMenu = ["Available", "Maintenance", "Lost", "Damaged"];

  const categoryMenu = [
    "Creative Tools",
    "Game Board",
    "IOT",
    "IOT Parts",
    "PC & Laptop",
    "Peripheral",
    "Others",
  ];

  const consumableMenu = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const initialState = {
    asset_name: "",
    asset_img: "",
    serial_number: "",
    location: "",
    room_number: "",
    cabinet: "",
    categories: "",
    total_items: 1,
    // item_status: "",
    desc: "",
    is_consumable: "",
  };

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );

  const [data, setData] = useState(initialState);
  const [image, setImage] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    asset_name,
    serial_number,
    categories,
    total_items,
    location,
    room_number,
    cabinet,
    desc,
    is_consumable,
  } = data;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categories") {
      setData({
        ...data,
        [name]: [value],
      });
    } else {
      setData({
        ...data,
        [name]: value,
        isError: "",
        isSuccess: "",
      });
    }

    if (name === "total_items" && value < 0) {
      e.target.value = 0;
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await convertFileToBase64(file);
        setImage(base64Image);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  const handleImageDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        const base64Image = await convertFileToBase64(file);
        setImage(base64Image);
        setIsDragging(false);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleAddInventory = (e) => {
    e.preventDefault();

    const addData = {
      ...data,
      asset_img: image,
    };

    dispatch(createInventory(addData)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(inventoryReset());
      navigate("/inventories/add_inventory");
    }

    if (isSuccess) {
      navigate("/inventories");
    }
  }, [isError, isSuccess, message]);

  const isFormValid =
    asset_name.trim() !== "" &&
    location.trim() !== "" &&
    room_number.trim() !== "" &&
    cabinet.trim() !== "" &&
    categories.length > 0 &&
    is_consumable !== "" &&
    desc.trim() !== "";

  return (
    <Layout>
      <DynamicBreadcrumbs />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex w-full justify-between items-center">
            <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
              Add an Inventory
            </h3>
          </div>

          <hr className="w-full border-indigo-100 my-4" />

          <div className="flex items-start px-5 py-4 my-2 w-full shadow-lg shadow-gray-300 rounded-md">
            <form className="flex w-full gap-4 flex-col lg:flex-row mb-4">
              <div className="flex md:basis-1/2 gap-2 flex-col w-full max-h-max items-center justify-start shadow-lg bg-indigo-50/40 rounded-md">
                <div
                  className={`flex items-center justify-center w-full h-64 border-2 ${
                    isDragging ? "border-indigo-500" : "border-gray-300"
                  } border-dashed rounded-lg cursor-pointer bg-gray-50`}
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <label
                    htmlFor="asset_img"
                    className="flex flex-col items-center justify-center w-full h-full border-1 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                  >
                    {image ? (
                      <img
                        className="h-full w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
                        src={image}
                        alt="image-item"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <IoCloudUploadOutline className="w-8 h-8 mb-4 text-gray-600 " />
                        <p className="mb-2 text-sm text-gray-600 ">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-600 ">
                          PNG, JPEG, or JPG
                        </p>
                      </div>
                    )}

                    <input
                      id="asset_img"
                      type="file"
                      className="hidden"
                      autoComplete="off"
                      name="asset_img"
                      accept=".jpeg, .png, .jpg"
                      onChange={handleImage}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 w-full p-4 bg-indigo-50/60 rounded-md shadow-lg">
                <div className="flex flex-col gap-1 justify-between w-full">
                  <div className="mb-6">
                    <label
                      htmlFor="asset_name"
                      className="text-gray-800 font-semibold lg:text-sm text-xs"
                    >
                      Item Name: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="asset_name"
                      name="asset_name"
                      value={asset_name}
                      placeholder="Asset/inventory name"
                      autoComplete="off"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-3 text-xs bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="serial_number"
                      className="text-gray-800 font-semibold lg:text-sm text-xs"
                    >
                      Serial Number:
                    </label>
                    <input
                      type="text"
                      id="serial_number"
                      name="serial_number"
                      value={serial_number}
                      placeholder="Serial number of item"
                      autoComplete="off"
                      onChange={handleChange}
                      className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="flex w-full flex-col md:flex-row gap-6 mb-6">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="categories"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Item Category: <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="categories"
                          name="categories"
                          value={categories || ""}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 text-xs p-3 bg-indigo-300/30 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option defaultValue="">Select item category</option>
                          {categoryMenu.map((category) => (
                            <option
                              key={category}
                              value={category.toLowerCase()}
                            >
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* <div className="flex flex-col w-full">
                      <label
                        htmlFor="item_status"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Item Status: <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="item_status"
                          name="item_status"
                          label="Select Item Status"
                          value={item_status || ""}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 text-xs p-3 bg-indigo-300/30 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option defaultValue="">Select item status</option>
                          {statusMenu.map((status, index) => (
                            <option
                              key={index}
                              value={status}
                              className="text-gray-900"
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div> */}

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="is_consumable"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Is Consumable? <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="is_consumable"
                          name="is_consumable"
                          value={is_consumable.toString()}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 text-xs p-3 bg-indigo-300/30 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option defaultValue="">Select Type</option>
                          {consumableMenu.map((option, index) => (
                            <option
                              key={index}
                              value={option.value.toString()}
                              className="text-gray-900"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="location"
                      className="text-gray-800 font-semibold lg:text-sm text-xs"
                    >
                      Item Location: <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={location}
                      placeholder="The location name where the item is stored"
                      onChange={handleChange}
                      className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="flex w-full flex-col md:flex-row gap-6 mb-6">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="room_number"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Item Room Number:{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="room_number"
                        name="room_number"
                        value={room_number}
                        placeholder="Room number of item"
                        onChange={handleChange}
                        className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="cabinet"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Item Cabinet: <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="cabinet"
                        name="cabinet"
                        value={cabinet}
                        placeholder="Cabinet Name"
                        onChange={handleChange}
                        className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="total_items"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Total Items: <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        id="total_items"
                        name="total_items"
                        min={0}
                        step={1}
                        value={total_items}
                        autoComplete="off"
                        onChange={handleChange}
                        className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="mb-0">
                    <label
                      htmlFor="desc"
                      className="text-gray-800 font-semibold lg:text-sm text-xs"
                    >
                      Item Description: <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      maxLength={500}
                      name="desc"
                      id="desc"
                      cols="30"
                      rows="6"
                      className="p-3 rounded-md outline-none text-xs w-full bg-indigo-300/30 placeholder:text-gray-700 sm:text-sm resize-none"
                      value={desc}
                      placeholder="Write the item description here..."
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <p className="mb-1 text-gray-600 text-xs text-right">
                    {characterLimit - desc.length}/{characterLimit} characters
                    left
                  </p>

                  <div className="flex w-full items-center justify-center md:justify-start text-white mt-4">
                    <Button
                      className={`text-sm py-2 px-8 rounded-lg capitalize ${
                        isFormValid
                          ? "bg-gradient-to-r from-indigo-500 to-purple-800"
                          : "bg-indigo-300 cursor-not-allowed"
                      }`}
                      onClick={() => handleOpenDialog("xs")}
                      disabled={!isFormValid} // Disable button jika form tidak valid
                    >
                      Add Inventory
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Add inventory open dialog */}
      <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={handleAddInventory}
        handleOpenDialog={handleOpenDialog}
        message="Add a inventory?"
        btnText="Add"
      />
    </Layout>
  );
};

export default AddInventoryPage;
