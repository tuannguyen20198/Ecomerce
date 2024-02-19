import React, { useEffect, useState } from "react";
import { apiGetCategories } from "../apis/app";
import { NavLink } from "react-router-dom";
import { createSlug } from "../ultils/helpers";

const Sidebar = () => {
  const [categories, setCategories] = useState(null);
  const fetchCategories = async () => {
    const response = await apiGetCategories();
    if (response.success) setCategories(response.prodCategories);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="flex flex-col border">
      {categories &&
        categories?.map((el) => (
          <NavLink
            key={createSlug(el.title)}
            to={createSlug(el.title)}
            className={({ isActive }) =>
              isActive
                ? "bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main"
                : "px-5 pt-[15px] pb-[14px] text-sm hover:text-main"
            }
          >
            {el.title}
          </NavLink>
        ))}
    </div>
  );
};

export default Sidebar;
