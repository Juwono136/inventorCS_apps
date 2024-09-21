import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { avatar, Avatar, Button } from "@material-tailwind/react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import SocialComponent from "../../components/DashboardComponents/SocialComponent";
import Loader from "../../common/Loader";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import { convertFileToBase64 } from "../../utils/convertToBase64";
import { getUserInfor, updateUser } from "../../features/user/userSlice";
import { accessToken } from "../../features/token/tokenSlice";

const MyProfile = () => {
  const characterLimit = 250;

  const addressMenu = [
    "FX Senayan Campus",
    "JWC Campus",
    "Anggrek Campus",
    "Syahdan Campus",
    "Alam Sutera Campus",
    "Binus School",
  ];

  const programMenu = [
    "Business Information Systems",
    "Business Managaement & Marketing",
    "Communications",
    "Computer Science",
    "Finance International Program",
    "International Business",
    "Graphic Design and New Media",
    "Digital Business",
  ];

  const roleMap = {
    0: "User",
    1: "Admin",
    2: "Staff",
  };

  const { userInfor, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  const initialState = {
    address: userInfor?.personal_info?.address || "",
    name: userInfor?.personal_info?.name || "",
    email: userInfor?.personal_info?.email || "",
    binusian_id: userInfor?.personal_info?.binusian_id || "",
    avatar: userInfor?.personal_info?.avatar || "",
    role: roleMap[userInfor?.personal_info?.role] || "",
    bio: userInfor?.personal_info?.bio || "",
    phone: userInfor?.personal_info?.phone || "",
    program: userInfor?.personal_info?.program || "",
    social_links: userInfor?.social_links || {
      youtube: userInfor?.social_links?.youtube || "",
      instagram: userInfor?.social_links?.instagram || "",
      facebook: userInfor?.social_links?.facebook || "",
      github: userInfor?.social_links?.github || "",
      twitter: userInfor?.social_links?.twitter || "",
      website: userInfor?.social_links?.website || "",
    },
    joinedAt: userInfor?.joinedAt || "",
    password: "",
    confirm_password: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState(initialState);
  const [image, setImage] = useState(data.avatar);

  const dispatch = useDispatch();

  useEffect(() => {
    setData(initialState);
  }, [userInfor]);

  const handleAvatar = async (e) => {
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

  const handleUpdateUser = (e) => {
    e.preventDefault();

    const newData = {
      ...data,
      avatar: image || data.avatar,
      youtube: data.social_links.youtube,
      instagram: data.social_links.instagram,
      facebook: data.social_links.facebook,
      github: data.social_links.github,
      twitter: data.social_links.twitter,
      website: data.social_links.website,
    };

    dispatch(updateUser(newData)).then((res) => {
      dispatch(accessToken(res));
    });

    setOpenDialog(!openDialog);
  };

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in data.social_links) {
      // Update social_links if the field is part of social_links
      setData({
        ...data,
        social_links: { ...data.social_links, [name]: value },
        isError: "",
        isSuccess: "",
      });
    } else {
      // Update other fields
      setData({ ...data, [name]: value, isError: "", isSuccess: "" });
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      // dispatch(userReset());
    }

    if (isSuccess) {
      toast.success(userInfor.message);
      dispatch(getUserInfor({ ...data, avatar: image }));
    }
    // console.log(data);
  }, [message, isError, isSuccess, dispatch]);

  return (
    <Layout>
      <h3 className="text-base text-center md:text-left font-bold text-indigo-500/60 pointer-events-non sm:text-xl ">
        My Profile
      </h3>
      <hr className="w-full border-indigo-100 my-4" />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start px-5 my-3 w-full shadow-sm shadow-gray-300 rounded-md">
          <form
            className="flex flex-col my-3 w-full gap-4 md:gap-8 md:flex-row"
            onSubmit={handleUpdateUser}
          >
            {/* profile image */}
            <div className="flex basis-1/4 gap-2 flex-col w-full p-3 items-center justify-start sm:border-r border-indigo-100">
              <div className="shrink-0">
                <Avatar
                  src={image || data.avatar}
                  alt="avatar"
                  size="xxl"
                  withBorder={true}
                  className="p-0.5"
                />
              </div>
              <label className="block py-2 w-[100px] relative cursor-pointer">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  accept=".jpeg, .png, .jpg"
                  name="avatar"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  autoComplete="off"
                  onChange={handleAvatar}
                />
                <div className="flex items-center justify-center w-full text-xs p-2 rounded-full border-0 font-semibold bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                  Edit Image
                </div>
              </label>

              <div className="text-center">
                <h1 className="text-indigo-800/80 text-sm">{data.name}</h1>

                <p className="text-indigo-600/80 text-xs">{data.email}</p>

                <p className="text-indigo-600/80 text-xs font-semibold mt-2">
                  {data.role}
                </p>
              </div>

              <div>
                <SocialComponent
                  social_links={data.social_links}
                  joinedAt={data.joinedAt}
                />
              </div>
            </div>

            {/* form profile */}
            <div className="flex basis-3/4 gap-1 md:gap-8 flex-col md:flex-row">
              <div className="basis-1/2">
                <div className="mb-6">
                  <label
                    htmlFor="binusian_id"
                    className="text-gray-800 text-sm"
                  >
                    Binusian ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="p-3 rounded-md outline-none md:text-sm w-full font-medium placeholder:text-gray-800 bg-blue-600/60 cursor-not-allowed"
                    type="text"
                    name="binusian_id"
                    id="binusian_id"
                    placeholder={data.binusian_id}
                    disabled
                    autoComplete="off"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="name" className="text-gray-800 text-sm">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    placeholder={data.name}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 p-3 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="text-gray-800 text-sm">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="p-3 rounded-md outline-none md:text-sm w-full font-medium placeholder:text-gray-800 bg-blue-600/60 cursor-not-allowed"
                    type="email"
                    name="email"
                    id="email"
                    placeholder={data.email}
                    disabled
                    autoComplete="off"
                  />
                </div>

                <div className="mb-3 mt-5">
                  <h3 className="text-xs text-red-500 italic underline">
                    Attention:
                  </h3>
                  <p className="text-xs text-red-300">
                    Changing the password here will automatically update your
                    password when you log in!
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      placeholder="********"
                      value={data.password}
                      onChange={handleChange}
                      type={`${showPassword ? "text" : "password"}`}
                      className="block w-full rounded-md border-0 p-3 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />

                    <div onClick={handleShowPassword}>
                      {!showPassword ? (
                        <FaRegEyeSlash className="absolute top-2 right-2 px-1 cursor-pointer text-2xl text-gray-900 hover:text-indigo-500" />
                      ) : (
                        <FaRegEye className="absolute top-2 right-2 px-1 cursor-pointer text-2xl text-gray-900 hover:text-indigo-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confirm_password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="********"
                      value={data.confirm_password}
                      onChange={handleChange}
                      type="password"
                      className="block w-full rounded-md border-0 p-3 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mb-0">
                  <label
                    htmlFor="bio"
                    className="block text-sm leading-6 text-gray-900"
                  >
                    My Bio
                  </label>
                  <textarea
                    maxLength={characterLimit}
                    name="bio"
                    id="bio"
                    cols="30"
                    rows="6"
                    className="p-3 rounded-md outline-none md:text-sm w-full font-medium bg-blue-600/30 placeholder:text-gray-800 resize-none"
                    onChange={handleChange}
                    value={data.bio}
                    placeholder={data.bio}
                  ></textarea>
                </div>

                <p className="mb-1 text-gray-600 text-xs text-right">
                  {characterLimit - data.bio.length}/{characterLimit} characters
                  left
                </p>
              </div>

              <div className="basis-1/2">
                <div className="mb-6">
                  <label htmlFor="phone" className="text-gray-800 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={data.phone}
                    placeholder={data.phone}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 p-3  bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="select"
                    className="block text-sm leading-6 text-gray-900"
                  >
                    Program
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="program"
                      name="program"
                      value={data.program || "Select Your Program"}
                      className="block w-full rounded-md border-0 p-3 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                      onClick={() => setDropDown(!dropDown)}
                    >
                      <option hidden disabled value="Select Your Program">
                        Select Your Program
                      </option>
                      {programMenu.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i
                        className={`${
                          dropDown ? "bx bx-chevron-up" : "bx bx-chevron-down"
                        } text-red-300 text-sm md:text-md`}
                      ></i>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="select"
                    className="block text-sm leading-6 text-gray-900"
                  >
                    Address
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="address"
                      name="address"
                      value={data.address || "Select Your Address"}
                      className="block w-full rounded-md border-0 p-3 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                      onClick={() => setDropDown(!dropDown)}
                    >
                      <option hidden disabled value="Select Your Address">
                        Select Your Address
                      </option>
                      {addressMenu.map((address) => (
                        <option key={address} value={address}>
                          {address}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i
                        className={`${
                          dropDown ? "bx bx-chevron-up" : "bx bx-chevron-down"
                        } text-red-300 text-sm md:text-md`}
                      ></i>
                    </div>
                  </div>
                </div>

                {/* edit social link */}
                <h1 className="text-sm font-semibold text-indigo-800 mb-2 underline">
                  My Social Media
                </h1>

                <div className="mb-3">
                  <label htmlFor="youtube" className="text-gray-800 text-sm">
                    Youtube
                  </label>
                  <input
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={data.social_links.youtube}
                    placeholder={data.social_links.youtube}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3 py-1.5 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="instagram" className="text-gray-800 text-sm">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={data.social_links.instagram}
                    placeholder={data.social_links.instagram}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3 py-1.5 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="facebook" className="text-gray-800 text-sm">
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={data.social_links.facebook}
                    placeholder={data.social_links.facebook}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3 py-1.5 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="github" className="text-gray-800 text-sm">
                    Github
                  </label>
                  <input
                    type="text"
                    id="github"
                    name="github"
                    value={data.social_links.github}
                    placeholder={data.social_links.github}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3 py-1.5 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="twitter" className="text-gray-800 text-sm">
                    Twitter / X
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={data.social_links.twitter}
                    placeholder={data.social_links.twitter}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3 py-1.5 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="website" className="text-gray-800 text-sm">
                    My Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={data.social_links.website}
                    placeholder={data.social_links.website}
                    onChange={handleChange}
                    autoComplete="off"
                    className="block w-full rounded-md border-0 px-3 py-1.5 bg-blue-600/30 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="my-8 text-white">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-500 text-sm py-2 px-5 rounded-lg capitalize"
                    onClick={() => handleOpenDialog("xs")}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Dialog logout button */}
          <DialogOpenComponent
            openDialog={openDialog}
            handleFunc={handleUpdateUser}
            handleOpenDialog={handleOpenDialog}
            message="Save user profile?"
            btnText="Save"
          />
        </div>
      )}
    </Layout>
  );
};

export default MyProfile;
