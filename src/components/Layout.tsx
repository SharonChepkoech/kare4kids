import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {/* Add padding to prevent content from being hidden under the fixed Navbar */}
      <main className="pt-16 p-6">{children}</main>
    </div>
  );
};

export default Layout;
