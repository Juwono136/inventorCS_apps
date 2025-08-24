import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// icons and material-tailwind
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import { MdOutlineRefresh } from "react-icons/md";

// components
import Layout from "./Layout";
import BorrowedItemTableComponent from "../../components/DashboardComponents/BorrowedItemTableComponent";
import AllMeetingsTableComponent from "../../components/DashboardComponents/AllMeetingsTableComponent";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

const BorrowedItemsPage = () => {
  UseDocumentTitle("Borrowed Item");

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "borrowedItems";
  const [activeTab, setActiveTab] = useState(tabParam);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    // Run when refreshing the page (first mount)
    if (isInitialMount.current) {
      isInitialMount.current = false; // Turn off the flag after the first run

      const cleanParams = {
        page: "1",
        search: "",
        tab: activeTab, // use activeTab state
      };

      if (activeTab === "meetingRequests") {
        cleanParams.meetingStatus = "";
      } else {
        cleanParams.loanStatus = "";
      }

      setSearchParams(cleanParams, { replace: true });
      return; // Stop further execution
    }

    // This logic runs for interactions after a refresh (e.g. changing tabs)
    if (params.tab !== activeTab) {
      params.tab = activeTab;
      setSearchParams(params);
    }
  }, [activeTab, searchParams, setSearchParams]);

  const handleTabChange = (newTab) => {
    const updatedParams = {
      page: "1",
      search: "",
      tab: newTab,
    };

    if (newTab === "meetingRequests") {
      updatedParams.meetingStatus = "";
    } else {
      updatedParams.loanStatus = "";
    }

    setSearchParams(updatedParams);
    setActiveTab(newTab);
  };

  const handleRefresh = () => {
    // Increment trigger to cause re-render in child
    setTimeout(() => setRefreshTrigger(0), 1000);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Layout>
      <DynamicBreadcrumbs />
      <div className="flex gap-3 items-center justify-between mb-2">
        <h3 className="text-base font-bold text-indigo-500/60 sm:text-xl">Borrowed Items Info</h3>
        <button
          onClick={handleRefresh}
          className="text-green-600 hover:text-green-900 flex gap-1 justify-center items-center bg-green-50 rounded-md p-1 md:px-2 md:py-1"
        >
          <MdOutlineRefresh
            className={`w-6 h-6 md:w-5 md:h-5 ${refreshTrigger ? "animate-spin" : ""}`}
          />
          <p className="text-xs hidden md:inline">Refresh page</p>
        </button>
      </div>
      <hr className="my-2 border-blue-gray-50" />

      <div className="mt-4">
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none flex gap-4 border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className: `${
                tabParam === "meetingRequests" ? "bg-orange-50" : "bg-indigo-50"
              } border-b-2 border-gray-800 shadow-none rounded-md`,
            }}
          >
            <Tab
              value="borrowedItems"
              onClick={() => handleTabChange("borrowedItems")}
              className={`${activeTab === "borrowedItems" ? "font-bold" : ""} w-auto text-sm p-2`}
            >
              Borrowed Items
            </Tab>
            <Tab
              value="meetingRequests"
              onClick={() => handleTabChange("meetingRequests")}
              className={`${activeTab === "meetingRequests" ? "font-bold" : ""} w-auto text-sm p-2`}
            >
              Meeting Requests
            </Tab>
          </TabsHeader>

          <TabsBody>
            <TabPanel value="borrowedItems" className="p-1">
              <BorrowedItemTableComponent refreshTrigger={refreshTrigger} />
            </TabPanel>
            <TabPanel value="meetingRequests" className="p-1">
              <AllMeetingsTableComponent refreshTrigger={refreshTrigger} />
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BorrowedItemsPage;
