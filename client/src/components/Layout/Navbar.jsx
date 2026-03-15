import { Menu, Search, ChevronDown, X } from "lucide-react";
import { FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { toggleSidebar } from "../../store/slices/popupSlice";
import { getAllCategories } from "../../store/slices/productSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated, authUser } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems?.reduce((total, item) => total + (item.quantity || 0), 0);
  const { categories } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate("/");
  };

  const performSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-ecommerce-heading/95 backdrop-blur-md shadow-lg text-ecommerce['nav-icon-hover'] border-b border-ecommerce-border/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT - LOGO + CATEGORIES */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-white/10 transition-all lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-ecommerce['nav-icon'] hover:text-ecommerce['nav-icon-hover'] hover:scale-110 transition-all duration-200" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <img src="/vite.svg" alt="ShopHub logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-white drop-shadow-sm">ShopHub</span>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShowCatDropdown(true)}
              onMouseLeave={() => setShowCatDropdown(false)}
            >
              <button className="flex items-center px-3 py-2 hover:bg-white/10 rounded-md transition-all text-ecommerce['nav-icon-hover'] hover:text-white">
                Categories <ChevronDown className="ml-1 w-4 h-4 transition-transform hover:rotate-180" />
              </button>
              {showCatDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-ecommerce-card shadow-lg rounded-md z-50 border border-ecommerce-border">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug || cat.name}`}
                      className="block px-4 py-2 text-ecommerce-text hover:bg-ecommerce['page-bg'] transition-all"
                      onClick={() => setShowCatDropdown(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER - SEARCH BAR */}
          <div className="flex-1 px-4 hidden lg:block">
            <form onSubmit={performSearch} className="relative">
              <input
                type="text"
                className="w-full py-2 pl-4 pr-10 rounded-full border border-ecommerce-border bg-ecommerce-card text-ecommerce-text focus:ring-2 ring-ecommerce-primary focus:border-ecommerce-primary shadow-sm transition-all placeholder:text-ecommerce-placeholder"
                placeholder="Search for products, brands and more"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ecommerce-placeholder hover:text-ecommerce-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* RIGHT - ICONS */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all lg:hidden"
              aria-label="Open search"
            >
              <Search className="w-5 h-5 text-ecommerce['nav-icon'] hover:text-ecommerce['nav-icon-hover'] hover:scale-110 transition-all duration-200" />
            </button>

            <Link
              to="/wishlist"
              className="lg:flex items-center p-2 rounded-lg hover:bg-white/10 transition-all"
              aria-label="Wishlist"
            >
              <FaHeart className="text-xl text-ecommerce['nav-icon'] hover:text-ecommerce['nav-icon-hover'] hover:scale-110 transition-all duration-200" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-white/10 transition-all"
              aria-label="Cart"
            >
              <FaShoppingCart className="text-xl text-ecommerce['nav-icon'] hover:text-ecommerce['nav-icon-hover'] hover:scale-110 transition-all duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ecommerce-badge text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold shadow-lg">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="lg:flex items-center px-4 py-2 bg-ecommerce-primary hover:bg-ecommerce['primary-hover'] text-white rounded-md transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
              >
                <FaUser className="w-4 h-4 mr-1" />
                Login
              </Link>
            )}

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all flex items-center relative group"
                >
                  {authUser?.avatar ? (
                    <img
                      src={authUser.avatar}
                      alt={authUser.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-ecommerce['nav-icon']/50 group-hover:ring-ecommerce['nav-active']"
                    />
                  ) : (
                    <FaUser className="text-xl text-ecommerce['nav-icon'] hover:text-ecommerce['nav-icon-hover'] hover:scale-110 transition-all duration-200" />
                  )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-ecommerce-card rounded-xl shadow-2xl py-2 z-50 border border-ecommerce-border ring-1 ring-ecommerce-border/50">
                    <div className="px-4 py-3 border-b border-ecommerce-border/50">
                      <p className="text-sm font-bold text-ecommerce-heading truncate">{authUser?.name}</p>
                      <p className="text-xs text-ecommerce-placeholder truncate">{authUser?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-ecommerce-text hover:bg-ecommerce['page-bg'] hover:text-ecommerce-primary transition-all flex items-center gap-3 rounded-lg mx-1 mt-1"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUser className="w-4 h-4 flex-shrink-0" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-sm text-ecommerce-text hover:bg-ecommerce['page-bg'] hover:text-ecommerce-primary transition-all flex items-center gap-3 rounded-lg mx-1"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaShoppingCart className="w-4 h-4 flex-shrink-0" />
                      My Orders
                    </Link>
                    {authUser?.role === "Admin" && (
                      <>
                        <div className="border-t border-ecommerce-border/50 my-1" />
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-3 text-sm text-ecommerce-text hover:bg-ecommerce-primary hover:text-white transition-all flex items-center gap-3 rounded-lg mx-1 font-semibold"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FaCog className="w-4 h-4 flex-shrink-0" />
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50/50 hover:text-red-600 transition-all flex items-center gap-3 rounded-lg mx-1 font-semibold active:scale-95"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-ecommerce-card rounded-2xl shadow-2xl p-8 border border-ecommerce-border ring-1 ring-ecommerce-primary/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-ecommerce-heading drop-shadow-sm">🔍 Search Products</h3>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="p-3 rounded-2xl hover:bg-ecommerce['page-bg'] transition-all hover:scale-110 active:scale-95 shadow-md"
                aria-label="Close search"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                performSearch(e);
                setShowSearch(false);
              }}
              className="relative"
            >
              <input
                type="text"
                className="w-full py-5 pl-6 pr-16 rounded-3xl border-2 border-ecommerce-border bg-ecommerce-card text-lg text-ecommerce-text focus:ring-4 ring-ecommerce-primary/30 focus:border-ecommerce-primary focus:shadow-2xl transition-all shadow-lg placeholder:text-ecommerce-placeholder"
                placeholder="Search for products, brands and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 rounded-2xl bg-ecommerce-primary/10 hover:bg-ecommerce-primary/20 text-ecommerce-primary hover:scale-110 transition-all shadow-md active:scale-95"
              >
                <Search className="w-7 h-7" />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
