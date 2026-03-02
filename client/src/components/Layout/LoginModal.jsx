import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setLoginModal } from "../../store/slices/popupSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.popup.isLoginModalOpen);
  const isAuthenticated = Boolean(useSelector((state) => state.auth.authUser));

  const [mode, setMode] = useState("login"); // or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Show login/signup only when popup open and user is NOT authenticated
  if (!isOpen || isAuthenticated) return null;

  const close = () => dispatch(setLoginModal(false));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: hook up to real auth API later
    toast.info(
      `${mode === "login" ? "Login" : "Sign up"} submitted (wire to API)`
    );
    close();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={close}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Welcome back" : "Create an account"}
              </p>
              <h2 className="text-xl font-semibold">
                {mode === "login" ? "Login" : "Sign up"}
              </h2>
            </div>
            <button
              onClick={close}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Close auth modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pt-4 flex gap-2">
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form className="px-6 py-4 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="block space-y-1">
                <span className="text-sm text-muted-foreground">Name</span>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                    required
                  />
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </label>
            )}

            <label className="block space-y-1">
              <span className="text-sm text-muted-foreground">Email</span>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                  required
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </label>

            <label className="block space-y-1">
              <span className="text-sm text-muted-foreground">Password</span>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 font-semibold shadow-md hover:opacity-90 transition-colors"
            >
              {mode === "login" ? "Login" : "Create account"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                className="w-full text-sm text-primary hover:underline text-center"
                onClick={() =>
                  toast.info("Forgot password flow not wired yet (add API call)")
                }
              >
                Forgot password?
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
