import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSearchBar,
  toggleSidebar,
  toggleCart,
  toggleAuthPopup,
} from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems?.reduce(
    (total, item) => total + (item.quantity ?? 0),
    0
  );

  return (
    <nav className="fixed left-0 w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        
          {/* CENTER - LOGO */}
          <div className="flex-1 flex justify-left space-x-1">
          <img src="/vite.svg" alt="ShopHub logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-primary">ShopHub</h1>
          </div>

          {/* RIGHT - ICONS */}
          <div className="flex items-center space-x-2">
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* SEARCH ICON */}
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Open search"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* USER PROFILE */}
            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Open profile"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>

            {/* CART */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            {/* LEFT - HAMBURGER MENU */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle navigation">
            <Menu className="w-9 h-9 text-foreground" />
          </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
