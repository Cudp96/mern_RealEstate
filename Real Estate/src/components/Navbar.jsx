import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    console.log(searchQuery);
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlsearchTerm = urlParams.get("searchTerm");
    if (urlsearchTerm) {
      setSearchTerm(urlsearchTerm);
    }
  }, [location.search]);
  return (
    <nav className="bg-slate-200 shadow-sm">
      <div className="flex justify-between mx-auto items-center max-w-4xl p-3">
        <h1 className="font-bold text-sm sm:text-lg flex flex-wrap">
          <span className="text-slate-500">Hello</span>
          <span className="text-slate-700">RealEstate</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex justify-center items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            id="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button>
            <FaSearch />
          </button>
        </form>
        <ul className="flex gap-3 font-bold justify-center items-center">
          <li className="hidden sm:inline hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:underline">
            <Link to="/about">About</Link>
          </li>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile Picture"
                className="rounded-full h-8 w-8 object-cover"
              />
            ) : (
              <li className="hidden sm:inline  hover:underline">
                <Link to="/sign-in">Sign In</Link>
              </li>
            )}
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
