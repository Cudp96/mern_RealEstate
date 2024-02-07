import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser.avatar)
  return (
    <nav className="bg-slate-200 shadow-sm">
      <div className="flex justify-between mx-auto items-center max-w-4xl p-3">
        <h1 className="font-bold text-sm sm:text-lg flex flex-wrap">
          <span className="text-slate-500">Hello</span>
          <span className="text-slate-700">RealEstate</span>
        </h1>
        <form className="bg-slate-100 p-3 rounded-lg flex justify-center items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch />
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
