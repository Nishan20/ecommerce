import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, clearError } from "../store/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isSigningUp, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  return (
    <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-lg"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-gray-300"
          >
            {isSigningUp ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
