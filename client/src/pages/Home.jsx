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
  const { products, categories, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts({ limit: 16 }));
    dispatch(getAllCategories());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <Categories />
      <ProductSlider title="Featured Products" products={products.slice(0, 10)} />
      <Deals />
      <FeatureSection />
      <Testimonials />
      <NewsletterSection />
    </>
  );
};

export default Home;
