import React from "react";
import NavbarComponent from "../../components/HomeComponents/NavbarComponent";

const InventoryLayout = ({ children }) => {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
          <div className="flex flex-col flex-grow overflow-hidden">
            <NavbarComponent />
            <main className="flex-grow overflow-x-auto px-6 py-4">
              {children}
            </main>
          </div>
        </div>
    </>
  );
};

export default InventoryLayout;
