import React from "react";

// components
import Layout from "./Layout";
import UseDocumentTitle from "../../common/UseDocumentTitle";

const DashboardPage = () => {
  UseDocumentTitle("Dashboard");
  return (
    <Layout>
      <h1>Dashboard Page component</h1>
    </Layout>
  );
};

export default DashboardPage;
