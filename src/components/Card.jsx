import { memo } from "react";

import { handleAuthorClick, handleCardClick } from "../util/helperFunctions";

const Card = memo(
  ({ id, title, download_url, views, duration, age, author }) => {
    console.log("card id: ", id);

    return (
      <div className="p-4">
        <div
          className="relative w-full h-48 cursor-pointer"
          onClick={() => handleCardClick(download_url)}
        >
          <img
            className="w-full h-full object-cover rounded-xl shadow hover:rounded-none hover:shadow-lg transition-shadow transition-rounded duration-300"
            src={download_url}
            alt={title}
            loading="lazy"
          />
          <p className=" dark:text-white absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs px-1 rounded">
            {duration}
          </p>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleCardClick(download_url)}
        >
          <h2 className="text-[rgb(15,15,15)] dark:text-[rgb(241,241,241)] truncate max-w-[200px]">
            {title}
          </h2>
          <p
            className="text-[rgb(96,96,96)] dark:text-[rgb(170,170,170)] dark:hover:text-[#f1f1f1] hover:text-[#0f0f0f]"
            onClick={(e) => handleAuthorClick(e, author)}
          >
            {author}
          </p>
          <p className="text-[rgb(96,96,96)] dark:text-[rgb(170,170,170)]">
            {views} <span className="text-[0.7em]">•</span> {age}
          </p>
        </div>
      </div>
    );
  }
);

export default Card;
