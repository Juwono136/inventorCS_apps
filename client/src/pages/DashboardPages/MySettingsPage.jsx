import React from "react";

// components
import Layout from "./Layout";
import DynamicBreadcrumbs from "../../common/DynamicBreadcrumbs";
import UseDocumentTitle from "../../common/UseDocumentTitle";

const MySettingsPage = () => {
  UseDocumentTitle("Settings");
  return (
    <Layout>
      <DynamicBreadcrumbs />
      <h1>My Settings page</h1>
    </Layout>
  );
};

export default MySettingsPage;
