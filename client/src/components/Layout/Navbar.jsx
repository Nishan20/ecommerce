import { Menu, User, ShoppingCart, Search, X, LogOut, ChevronDown, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { getAllCategories } from "../../store/slices/productSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT - LOGO + CATEGORIES */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <img src="/vite.svg" alt="ShopHub logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-primary">ShopHub</span>
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShowCatDropdown(true)}
              onMouseLeave={() => setShowCatDropdown(false)}
            >
              <button className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md transition-colors">
                Categories <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {showCatDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug || cat.name}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
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
                className="w-full py-2 pl-4 pr-10 rounded-full border focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search for products, brands and more"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* RIGHT - ICONS */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Open search"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            <Link
              to="/wishlist"
              className="hidden lg:flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="hidden lg:flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5 mr-1" />
                <span className="text-sm">Login</span>
              </Link>
            )}

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                >
                  {authUser?.avatar ? (
                    <img
                      src={authUser.avatar}
                      alt={authUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-700" />
                  )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{authUser?.name}</p>
                      <p className="text-xs text-gray-500">{authUser?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Orders
                    </Link>
                    {authUser?.role === "Admin" && (
                      <>
                        <div className="border-t my-2" />
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {isMenuOpen && (
              <div className="lg:hidden bg-white border-t">
                <div className="px-4 py-4 space-y-3">
                  <Link
                    to="/"
                    className="block text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/products"
                    className="block text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    to="/about"
                    className="block text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="block text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Products</h3>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
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
                className="w-full py-3 pl-4 pr-12 rounded-full border focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search for products, brands and more"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

