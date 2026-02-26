import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="home">
        <section className="hero">
          <h1>Shop smarter, faster</h1>
          <p>Discover quality products with smooth checkout.</p>
          <button>Start Shopping</button>
        </section>

        <section className="features">
          <article><h3>Fast Delivery</h3><p>Get orders quickly.</p></article>
          <article><h3>Secure Payment</h3><p>Trusted checkout flow.</p></article>
          <article><h3>Easy Returns</h3><p>Hassle-free process.</p></article>
        </section>
      </main>
      <Footer />
    </>
  );
}
