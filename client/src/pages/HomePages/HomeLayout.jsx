import React from "react";

// components
import HeroComponent from "../../components/HomeComponents/HeroComponent";
import InventoriesSummaryComponent from "../../components/HomeComponents/InventoriesSummaryComponent";
import TeamComponent from "../../components/HomeComponents/TeamComponent";
import FooterComponent from "../../components/HomeComponents/FooterComponent";
import ScrollUp from "../../common/ScrollUp";

const Home = () => {
  return (
    <>
      <HeroComponent />
      <InventoriesSummaryComponent />
      <TeamComponent />
      <FooterComponent />
      <ScrollUp />
    </>
  );
};

export default Home;
