import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import GroceryLogo from "./GroceryLogo";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if(data.success){
        toast.success(data.message);
         setUser(null);
      navigate("/");
      }
      else{
            toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
   
  };

  useEffect(() => {
if(searchQuery.length > 0){
  navigate("/products")
}
  }, [searchQuery])


  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 backdrop-blur-2xl
    relative transition-all sticky top-0 z-50 drop-shadow-2xl"> 
      <NavLink to="/" onClick={() => setOpen(false)}>
      <div className="flex items-center">
      <GroceryLogo />
        <h1 className="font-bold md:text-3xl sm:text-xl bg-gradient-to-r from-green-600 via-pink-500 to-orange-600 bg-clip-text 
        text-transparent hover:scale-105">
          GROOFY
        </h1>
      </div>
      
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" className="focus:underline focus:text-primary hover:scale-105">Home</NavLink>
        <NavLink to="/products" className="focus:underline focus:text-primary hover:scale-105">All Product</NavLink>
        <NavLink to="/" className="focus:underline focus:text-primary hover:scale-105">Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} alt="" className="w-10" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
              <li onClick={() => navigate("my-orders")} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">My Orders</li>
              <li onClick={logout} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex items-center gap-6 sm:hidden">
      <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        aria-label="Menu"
        className=""
      >
        {/* Menu Icon SVG */}
        <img src={assets.menu_icon} alt="menu" />
      </button>

      </div>

     
      {/* Mobile Menu */}
      {open && (
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
        >
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Product
          </NavLink>
          {user && (
            <NavLink to="/" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          <NavLink to="/" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
