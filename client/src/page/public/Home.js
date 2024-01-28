import React from "react";
import { Header, Navigation, Sidebar, Banner } from "../../components";
const Home = () => {
  return (
    <div className="w-main flex">
      <div className="flex flex-col gap-5 w-[3%] flex-auto border">
        <Sidebar />
        <span>Deal daliy</span>
      </div>
      <div className="flex flex-col gap-5 pl-5 w-[70%] flex-auto border">
        <Banner />
        <span>Best seller</span>
      </div>
    </div>
  );
};

export default Home;
