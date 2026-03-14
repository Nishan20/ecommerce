import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getAllCategories } from "../store/slices/productSlice";

import Hero from "../components/sections/Hero";
import Categories from "../components/sections/Categories";
import ProductSlider from "../components/Home/ProductSlider"; // can remain here
import Deals from "../components/sections/Deals";
import Testimonials from "../components/sections/Testimonials";
import FeatureSection from "../components/sections/FeatureSection";
import NewsletterSection from "../components/sections/NewsletterSection";

const Home = () => {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts({ limit: 16 }));
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="pt-16">
      {/* Hero banner */}
      <Hero />

      {/* Categories grid */}
      <Categories />

      {/* Trending / featured products slider */}
      {products?.length > 0 && (
        <ProductSlider title="Trending Now" products={products.slice(0, 12)} />
      )}

      {/* Deals section */}
      <Deals />

      {/* Testimonials */}
      <Testimonials />

      {/* Feature highlights */}
      <FeatureSection />

      {/* Newsletter CTA */}
      <NewsletterSection />
    </div>
  );
};

export default Home;
