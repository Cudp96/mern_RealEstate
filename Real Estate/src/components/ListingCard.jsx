import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://img.freepik.com/free-photo/blue-house-with-blue-roof-sky-background_1340-25953.jpg"
          }
          alt="Image of listinging"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 "
        />
        <div className="p-3 flex flex-col gap-4">
          <p className=" truncate text-lg font-semibold text-slate-700 ">
            {listing.name}
          </p>
          <div className="flex gap-2 items-center">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="truncate text-gray-600 text-sm w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-600 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex gap-2 text-slate-700">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedroom} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
