import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import toast from "react-hot-toast";

// icons and material-tailwind
import { Button, Chip, Typography } from "@material-tailwind/react";
import { TiFolderDelete } from "react-icons/ti";

// components
import Layout from "./Layout";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import Loader from "../../common/Loader";
import BackButton from "../../common/BackButton";
import UseDocumentTitle from "../../common/UseDocumentTitle";
import FullScreenImage from "../../common/FullScreenImage";
import FullScreenQRCode from "../../common/FullScreenQRCode";
import { getFullDay } from "../../common/Date";

// features
import { convertFileToBase64 } from "../../utils/convertToBase64";
import {
  draftInventory,
  getInventoryById,
  updateInventory,
} from "../../features/inventory/inventorySlice";
import { accessToken } from "../../features/token/tokenSlice";

const UpdateInventoryPage = () => {
  UseDocumentTitle("Update Inventory");

  const characterLimit = 500;

  const categoryMenu = [
    "Creative Tools",
    "Board Game",
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

  const statusColors = {
    Available: "green",
    Maintenance: "orange",
    Lost: "red",
    Damaged: "purple",
  };

  const initialState = {
    asset_id: "",
    asset_name: "",
    asset_img: "",
    serial_number: "",
    categories: "",
    item_status: "",
    total_items: 0,
    location: "",
    room_number: "",
    cabinet: "",
    desc: "",
    is_consumable: false,
  };

  const { id } = useParams();
  const { inventoryById, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );

  useEffect(() => {
    if (inventoryById) {
      setSelectedItem({
        asset_id: inventoryById?.asset_id || "",
        asset_name: inventoryById?.asset_name || "",
        asset_img: inventoryById?.asset_img || "",
        serial_number: inventoryById?.serial_number || "",
        categories:
          Array.isArray(inventoryById?.categories) &&
          inventoryById.categories.length > 0
            ? inventoryById.categories[0]
            : "",
        item_status: inventoryById?.item_status || "Available",
        total_items: inventoryById?.total_items || 0,
        location: inventoryById?.location || "",
        room_number: inventoryById?.room_number || "",
        cabinet: inventoryById?.cabinet || "",
        desc: inventoryById?.desc || "",
        is_consumable: inventoryById?.is_consumable || false,
      });

      // Set image state separately if it exists
      if (inventoryById?.asset_img) {
        setImage(inventoryById.asset_img);
      }
    }
  }, [inventoryById]);

  const [selectedItem, setSelectedItem] = useState(initialState);
  const [image, setImage] = useState("");
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const [isQRCodeModalOpen, setQRCodeModalOpen] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState("");
  const [openDraftInventory, setOpenDraftinventory] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    asset_name,
    serial_number,
    categories,
    item_status,
    total_items,
    location,
    room_number,
    cabinet,
    desc,
    is_consumable,
  } = selectedItem;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenDraftLoan = (id) => {
    setOpenDraftinventory(!openDraftInventory);
    setSelectedId(id);
  };

  const handleDraftInventory = (id) => {
    dispatch(draftInventory(id)).then(() => {
      navigate("/inventories");
    });

    setOpenDraftinventory(!openDraftInventory);
  };

  const handleOpenQRCodeModal = (value) => {
    setQRCodeModalOpen(true);
    setQRCodeValue(value);
  };

  const handleCloseQRCodeModal = () => {
    setQRCodeModalOpen(false);
    setQRCodeValue("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value < 0) {
      e.target.value = 0;
    }

    setSelectedItem((prev) => {
      const updatedItem = {
        ...prev,
        [name]: value,
        isError: "",
        isSuccess: "",
      };

      return updatedItem;
    });
  };

  const handleOpenDialogSave = () => {
    setOpenDialogSave(!openDialogSave);
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await convertFileToBase64(file);
        setImage(base64Image);
      } catch (error) {
        console.error("Error converting image:", error);
        toast.error("Error uploading image. Please try again.");
      }
    }
  };

  const handleUpdateInventory = (e) => {
    e.preventDefault();

    const updateData = {
      _id: id,
      ...selectedItem,
      asset_img: image || selectedItem.asset_img,
      categories: [categories].filter(Boolean),
    };

    dispatch(updateInventory(updateData)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenDialogSave(!openDialogSave);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }

    if (id) {
      dispatch(getInventoryById(id));
    }
  }, [isError, isSuccess, message, dispatch, id]);

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center">
            <BackButton link="/inventories" />
          </div>

          <div className="flex w-full justify-between items-center">
            <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
              Update Inventory
            </h3>

            <Button
              className="flex justify-center items-center gap-1 bg-red-600 text-xs py-2 px-3 rounded-lg capitalize transition-all"
              onClick={() => handleOpenDraftLoan(inventoryById?._id)}
            >
              <TiFolderDelete className="text-lg font-semibold" />
              Draft Item
            </Button>
          </div>

          <hr className="w-full border-indigo-100 my-4" />

          <div className="flex flex-col items-start px-5 py-4 my-2 w-full shadow-lg shadow-gray-300 rounded-md">
            <div className="flex w-full gap-4 flex-col lg:flex-row">
              {/* Inventory summary info */}
              <div className="flex md:basis-1/2 gap-2 flex-col w-full items-center justify-start shadow-lg bg-indigo-50/40 rounded-md">
                <div className="flex flex-col gap-4 px-2 py-4 justify-center items-center w-full">
                  <FullScreenImage
                    src={inventoryById.asset_img}
                    alt="item-image"
                  >
                    <img
                      className="h-96 md:h-full w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
                      src={image || inventoryById?.asset_img}
                      alt="item image"
                    />
                  </FullScreenImage>
                  <label className="block py-2 w-[200px] relative cursor-pointer">
                    <span className="sr-only">Choose item image</span>
                    <input
                      type="file"
                      accept=".jpeg, .png, .jpg"
                      name="asset_img"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      autoComplete="off"
                      onChange={handleImage}
                    />
                    <div className="flex items-center justify-center w-full text-xs p-2 rounded-full border-0 font-semibold bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                      Change Image
                    </div>
                  </label>

                  <div className="flex gap-4 w-full flex-col-reverse lg:flex-row lg:justify-between lg:items-start justify-center items-center rounded-xl border border-indigo-100 bg-indigo-100/30 p-4 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start">
                      <h2 className="text-sm md:text-lg font-semibold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                        {inventoryById?.asset_name}
                      </h2>
                      <div className="flex flex-col py-2 gap-2 items-center lg:items-start">
                        {/* <h3 className="text-xs text-gray-700">CRE/02/GLASS</h3> */}

                        <Typography className="text-xs text-gray-700">
                          Asset ID: {inventoryById?.asset_id}
                        </Typography>

                        <Typography className="text-xs text-gray-700">
                          Serial Number:{" "}
                          {!inventoryById?.serial_number?.length
                            ? "-"
                            : inventoryById?.serial_number}
                        </Typography>

                        <Typography className="text-xs text-gray-700">
                          Created At: {getFullDay(inventoryById?.publishedAt)}
                        </Typography>
                        <Typography className="text-xs text-gray-700">
                          Updated At: {getFullDay(inventoryById?.updatedAt)}
                        </Typography>
                      </div>

                      <div className="flex w-full justify-center items-center lg:justify-start">
                        <Chip
                          size="sm"
                          value={item_status}
                          color={statusColors[item_status] || "gray"}
                          variant="ghost"
                          className="rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex">
                      <div
                        className="w-max rounded-lg p-2 border border-indigo-100 bg-indigo-100/30 hover:cursor-pointer hover:bg-indigo-100/60 transition-all"
                        onClick={() =>
                          handleOpenQRCodeModal(
                            `${window.location.origin}/item_detail/${inventoryById?._id}`
                          )
                        }
                      >
                        <QRCode
                          value={`${window.location.origin}/item_detail/${inventoryById?._id}`}
                          size={100}
                          logoWidth={16}
                          eyeRadius={5}
                          eyeColor="#161D6F"
                          fgColor="#161D6F"
                          qrStyle="dots"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory detail info */}
              <div className="flex gap-4 w-full p-4 bg-indigo-50/60 rounded-md shadow-lg">
                <form className="flex flex-col gap-8 w-full">
                  <div>
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
                      placeholder={asset_name}
                      onChange={handleChange}
                      autoComplete="off"
                      className="block w-full rounded-md border-0 p-3 text-xs bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div>
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
                      value={!serial_number.length ? "-" : serial_number}
                      placeholder={serial_number}
                      onChange={handleChange}
                      autoComplete="off"
                      className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="flex w-full flex-col md:flex-row gap-6">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="categories"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Item Category:
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="categories"
                          name="categories"
                          value={categories}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 text-xs p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          {categoryMenu.map((category, index) => (
                            <option
                              key={index}
                              value={category.toLowerCase()}
                              className="text-gray-900"
                            >
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="is_consumable"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Is Consumable?
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="is_consumable"
                          name="is_consumable"
                          value={is_consumable.toString()}
                          onChange={handleChange}
                          className="block w-full rounded-md border-0 text-xs p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
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

                  <div>
                    <label
                      htmlFor="location"
                      className="text-gray-800 font-semibold lg:text-sm text-xs"
                    >
                      Item Location:
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={location}
                      placeholder={location}
                      onChange={handleChange}
                      autoComplete="off"
                      className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="flex w-full flex-col md:flex-row gap-6">
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="room_number"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Item Room Number:
                      </label>
                      <input
                        type="text"
                        id="room_number"
                        name="room_number"
                        value={room_number}
                        placeholder={room_number}
                        onChange={handleChange}
                        autoComplete="off"
                        className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="cabinet"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Item Cabinet:
                      </label>
                      <input
                        type="text"
                        id="cabinet"
                        name="cabinet"
                        value={cabinet}
                        placeholder={cabinet}
                        onChange={handleChange}
                        autoComplete="off"
                        className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="total_items"
                        className="text-gray-800 font-semibold lg:text-sm text-xs"
                      >
                        Total Items:
                      </label>
                      <input
                        type="number"
                        id="total_items"
                        name="total_items"
                        min={0}
                        step={1}
                        value={total_items}
                        placeholder={total_items}
                        onChange={handleChange}
                        autoComplete="off"
                        className="block w-full rounded-md text-xs border-0 p-3 bg-indigo-300/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="mb-0">
                    <label
                      htmlFor="desc"
                      className="text-gray-800 font-semibold lg:text-sm text-xs"
                    >
                      Item Description:
                    </label>
                    <textarea
                      maxLength={500}
                      name="desc"
                      id="desc"
                      cols="30"
                      rows="6"
                      className="p-3 rounded-md outline-none text-xs w-full bg-indigo-300/30 placeholder:text-gray-300 sm:text-sm resize-none"
                      value={desc}
                      placeholder={desc}
                      onChange={handleChange}
                    ></textarea>
                    <p className="mb-1 text-gray-600 text-xs text-right">
                      {characterLimit - desc.length}/{characterLimit} characters
                      left
                    </p>
                  </div>

                  <div className="flex w-full items-center justify-center md:justify-start text-white">
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-purple-800 text-sm py-2 px-8 rounded-lg capitalize"
                      onClick={() => handleOpenDialogSave("xs")}
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* save inventory open dialog */}
      <DialogOpenComponent
        openDialog={openDialogSave}
        handleFunc={handleUpdateInventory}
        handleOpenDialog={handleOpenDialogSave}
        message="Save update item?"
        btnText="Save"
      />

      {/* Draft Inventory dialog component */}
      <DialogOpenComponent
        openDialog={openDraftInventory}
        handleFunc={() => handleDraftInventory(selectedId)}
        handleOpenDialog={handleOpenDraftLoan}
        message="Are you sure want to draft this inventory?"
        btnText="Yes"
      />

      {/* Fullscreen QR Code Modal */}
      <FullScreenQRCode
        isOpen={isQRCodeModalOpen}
        onClose={handleCloseQRCodeModal}
        qrValue={qrCodeValue}
        text="Scan The Inventory Detail"
      />
    </Layout>
  );
};

export default UpdateInventoryPage;
