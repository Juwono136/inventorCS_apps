import React from "react";
import { useSelector } from "react-redux";

// icons and material-tailwind
import {
  MdOutlineInventory2,
  MdOutlineMeetingRoom,
  MdOutlineFactCheck,
} from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { HiOutlineShoppingCart } from "react-icons/hi";

// components
import Layout from "./Layout";
import UseDocumentTitle from "../../common/UseDocumentTitle";

const DashboardPage = () => {
  UseDocumentTitle("Dashboard");

  const { userInfor } = useSelector((state) => state.user);

  return (
    <Layout>
      <h3 className="text-base font-bold text-gray-800/60 pointer-events-none sm:text-lg mb-2 md:mb-0">
        Welcome,{" "}
        <span className="text-indigo-600/80">
          {userInfor?.personal_info?.name}
        </span>
      </h3>

      <div className="flex w-full flex-col gap-6 pt-4">
        {/* dashboard card components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6 w-full">
          {/* total inventories card */}
          <div className="flex flex-col gap-2 rounded-lg p-4 border border-indigo-100 bg-white shadow-sm">
            <div className="flex w-full justify-between items-center pb-3">
              <div className="p-2 border border-gray-400 rounded-md">
                <MdOutlineInventory2 className="text-base" />
              </div>
              <a
                href="/inventories"
                className="p-2 hover:bg-gray-200 rounded-md transition ease-in-out"
              >
                <IoMdMore className="text-lg" />
              </a>
            </div>
            <div className="text-xs text-gray-700">Total Inventories</div>
            <div className="flex w-full justify-between items-center">
              <h1 className="text-lg md:text-2xl text-gray-800">791</h1>

              <div className="flex gap-1.5 justify-center items-center text-xs text-green-600 border border-green-500/60 px-2 py-0.5 rounded-full hover:bg-green-100 transition ease-in-out">
                <FaArrowUp />
                16%
              </div>
            </div>
          </div>

          {/* total loan transactions card */}
          <div className="flex flex-col gap-2 rounded-lg p-4 border border-indigo-100 bg-white shadow-sm">
            <div className="flex w-full justify-between items-center pb-3">
              <div className="p-2 border border-gray-400 rounded-md">
                <BsCartCheck className="text-base" />
              </div>
              <a
                href="/borrowed-item"
                className="p-2 hover:bg-gray-200 rounded-md transition ease-in-out"
              >
                <IoMdMore className="text-lg" />
              </a>
            </div>
            <div className="text-xs text-gray-700">Total Loan Transactions</div>
            <div className="flex w-full justify-between items-center">
              <h1 className="text-lg md:text-2xl text-gray-800">231</h1>

              <div className="flex gap-1.5 justify-center items-center text-xs text-red-600 border border-red-500/60 px-2 py-0.5 rounded-full hover:bg-red-100 transition ease-in-out">
                <FaArrowDown />
                5%
              </div>
            </div>
          </div>

          {/* total request meetings card */}
          <div className="flex flex-col gap-2 rounded-lg p-4 border border-indigo-100 bg-white shadow-sm">
            <div className="flex w-full justify-between items-center pb-3">
              <div className="p-2 border border-gray-400 rounded-md">
                <MdOutlineMeetingRoom className="text-base" />
              </div>
              <a
                href="/borrowed-item?page=1&search=&tab=meetingRequests&meetingStatus="
                className="p-2 hover:bg-gray-200 rounded-md transition ease-in-out"
              >
                <IoMdMore className="text-lg" />
              </a>
            </div>
            <div className="text-xs text-gray-700">Total Meeting Requests</div>
            <div className="flex w-full justify-between items-center">
              <h1 className="text-lg md:text-2xl text-gray-800">230</h1>

              <div className="flex gap-1.5 justify-center items-center text-xs text-green-600 border border-green-500/60 px-2 py-0.5 rounded-full hover:bg-green-100 transition ease-in-out">
                <FaArrowUp />
                9%
              </div>
            </div>
          </div>

          {/* loan status card */}
          <div className="col-span-1 xl:col-span-2 flex flex-col gap-4 rounded-lg p-4 border border-indigo-100 bg-white shadow-sm">
            <div className="flex w-full justify-between items-center">
              <div className="p-2 border border-gray-400 rounded-md">
                <HiOutlineShoppingCart className="text-base" />
              </div>
              <a
                href="/borrowed-item"
                className="p-2 hover:bg-gray-200 rounded-md transition ease-in-out"
              >
                <IoMdMore className="text-lg" />
              </a>
            </div>
            <div>Total loan status card</div>
          </div>

          {/* meeting status card */}
          <div className="col-span-1 sm:col-span-2 xl:col-span-2 flex flex-col gap-4 rounded-lg p-4 border border-indigo-100 bg-white shadow-sm">
            <div className="flex w-full justify-between items-center">
              <div className="p-2 border border-gray-400 rounded-md">
                <MdOutlineFactCheck className="text-base" />
              </div>
              <a
                href="/borrowed-item?page=1&search=&tab=meetingRequests&meetingStatus="
                className="p-2 hover:bg-gray-200 rounded-md transition ease-in-out"
              >
                <IoMdMore className="text-lg" />
              </a>
            </div>
            <div>Total meeting status card</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
