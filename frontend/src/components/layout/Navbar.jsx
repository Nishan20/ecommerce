export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="/" className="logo">
          eCommerce
        </a>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/login">Login</a>
        </nav>

        <a href="/products" className="nav-cta">
          Shop Now
        </a>
      </div>
    </header>
  );
}
