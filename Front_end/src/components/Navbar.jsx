import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../store/authSlice";
import { Wallet, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/signin");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm fixed w-full z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition"
          >
            <Wallet className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              ExpenseMaster
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/expenses"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  Expenses
                </Link>
                <Link
                  to="/account"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  Account
                </Link>
              </>
            )}
            <Link
              to="/about"
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-indigo-600 font-medium transition"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  Hello, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                Expenses
              </Link>
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                Account
              </Link>
            </>
          )}
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
          >
            Contact
          </Link>
          {user ? (
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md font-medium text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="block text-center px-3 py-2 rounded-md font-medium text-gray-700 border border-gray-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-center px-3 py-2 rounded-md font-medium text-white bg-indigo-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
