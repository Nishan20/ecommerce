import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  Package,
  Grid3X3,
  List,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, setAuthPopup, setLoginModal } from "../../store/slices/popupSlice";
import { useTheme } from "../../contexts/ThemeContext";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/products", label: "All Products", icon: Package },
  { to: "/categories", label: "Categories", icon: Grid3X3 },
  { to: "/orders", label: "My Orders", icon: List },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isOpen = useSelector((state) => state.popup.isSidebarOpen);
  const authUser = useSelector((state) => state.auth.authUser);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems?.reduce(
    (total, item) => total + (item.quantity ?? 0),
    0
  );

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Close sidebar on navigation
  useEffect(() => {
    if (isOpen) {
      dispatch(toggleSidebar());
    }
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => dispatch(toggleSidebar())}
          />

          {/* panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-background border-r border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">
                  S
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ShopHub</p>
                  <p className="font-semibold text-foreground">Menu</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="py-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => dispatch(toggleSidebar())}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-secondary/60"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.to === "/cart" && cartCount > 0 && (
                          <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t border-border space-y-3">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-secondary/60"
              >
                <span>Theme</span>
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {authUser ? (
                <button
                  onClick={() => {
                    // Handle logout
                    dispatch(setAuthPopup(true));
                    dispatch(toggleSidebar());
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-500 text-white font-semibold hover:opacity-90"
                >
                  <span>Logout</span>
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(setAuthPopup(false));
                    dispatch(setLoginModal(true));
                    dispatch(toggleSidebar());
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
                >
                  <span>Login / Sign up</span>
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
