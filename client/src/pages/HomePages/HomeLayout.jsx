import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// components
import HeroComponent from "../../components/HomeComponents/HeroComponent";
import InventoriesSummaryComponent from "../../components/HomeComponents/InventoriesSummaryComponent";
import TeamComponent from "../../components/HomeComponents/TeamComponent";
import FooterComponent from "../../components/HomeComponents/FooterComponent";
import ScrollUp from "../../common/ScrollUp";

// features
import { getAllInventories } from "../../features/inventory/inventorySlice";

const Home = ({ page, sort }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllInventories({ page, sort }));
  }, [page, sort]);

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
