import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    offer: false,
    furnished: false,
    sort: "created_at",
    order: "desc",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({
        ...sideBarData,
        type: e.target.id,
      });
    }

    if (e.target.id === "searchTerm") {
      setSideBarData({
        ...sideBarData,
        searchTerm: e.target.value,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created-at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData }, sort, order);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search/${searchQuery}`);
  };
  return (
    <section className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
          <div className="flex items-center gap-2 ">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="type" className="font-semibold">
              Type:
            </label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span>Rent and Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span>Parking</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort :</label>
            <select
              name="sort"
              id="sort_order"
              className="border rounded-lg p-2"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price High To Low</option>
              <option value="regularPrice_asc"> Price Low To High</option>
              <option value="created_at_desc">Latest</option>
              <option value="created_at_asc">Oldest</option>
            </select>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-2xl font-semibold text-center border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
      </div>
    </section>
  );
};

export default Search;
