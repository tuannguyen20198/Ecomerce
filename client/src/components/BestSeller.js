import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";

const tabs = [
  { id: 1, name: "best seller" },
  { id: 2, name: "new arrivals" },
  //   { id: 3, name: "tablets" },
];
const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    if (response[0]?.success) setBestSellers(response[0].products);
    if (response[1]?.success) setNewProducts(response[1].products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-semibold capitalize border-r text-gray-400 cursor-pointer  ${
              activeTab === el.id ? "text-black" : ""
            }`}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
