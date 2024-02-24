import React from "react";
import { fortmatMoney } from "../ultils/helpers";
import label from "../assets/label.png";
import labelBue from "../assets/label-blue.png";

const Product = ({ productData, isNew }) => {
  console.log(productData);
  return (
    <div className="w-full text-[12px] px-[10px]">
      <div className="w-full border p-[15px] flex flex-col items-center">
        <div className="w-full relative">
          <img
            src={
              productData?.thumb ||
              "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg"
            }
            alt=""
            className="w-[243px] h-[243ox] object-cover"
          />
          <img
            src={isNew ? label : labelBue}
            alt=""
            className={`absolute top-[-20px] left-[-23px] ${
              isNew ? "w-[100px]" : "w-[90px]"
            }  h-[35px] object-cover`}
          />

          {isNew ? (
            <span className="font-bold top-[-10px] left-[-10px] text-white absolute">
              New
            </span>
          ) : (
            <span className="font-bold top-[-10px] left-[-10px] text-white absolute">
              Trending
            </span>
          )}
        </div>
        <div className="flex flex-col mt-[15px] justify-start items-start gap-1 w-full">
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${fortmatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
