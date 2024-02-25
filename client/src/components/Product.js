import React, { useState } from "react";
import { fortmatMoney } from "../ultils/helpers";
import trending from "../assets/trending.png";
import label from "../assets/new.png";
import { renderStarFromNumber } from "../ultils/helpers";
import SelectOption from "./SelectOption";
import icons from "../ultils/icons";

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons;
const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  return (
    <div className="w-full text-base px-[10px]">
      <div className="w-full border p-[15px] flex flex-col items-center">
        <div
          className="w-full relative"
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsShowOption(true);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsShowOption(false);
          }}
        >
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <SelectOption icon={<AiFillEye />} />
              <SelectOption icon={<AiOutlineMenu />} />
              <SelectOption icon={<BsFillSuitHeartFill />} />
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg"
            }
            alt=""
            className="w-[274px] h-[274px] object-cover"
          />
          <img
            src={isNew ? label : trending}
            alt=""
            className={`absolute w-[100px] h-[35px] top-[0] right-[0] object-cover`}
          />
        </div>
        <div className="flex flex-col mt-[15px] justify-start items-start gap-1 w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${fortmatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
