import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// reuse the hero slider data from previous implementation
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=2100&q=80",
    title: "Latest Gadgets",
    subtitle: "Up to 50% off on electronics",
    cta: "Shop Now",
    url: "/products?category=Electronics",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=2100&q=80",
    title: "Fashion Fiesta",
    subtitle: "Trendy styles for every occasion",
    cta: "Explore Fashion",
    url: "/products?category=Fashion",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2100&q=80",
    title: "Home Makeover",
    subtitle: "Decor and furniture deals up to 60% off",
    cta: "Shop Home",
    url: "/products?category=Home",
  },
];

const Hero = () => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "left" ? -sliderRef.current.offsetWidth : sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex w-full scroll-smooth snap-x snap-mandatory overflow-x-auto scrollbar-hide" ref={sliderRef}>
        {slides.map((slide) => (
          <Link
            key={slide.id}
            to={slide.url}
            className="relative w-full snap-center flex-shrink-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-[60vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="max-w-2xl px-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl text-white mb-6">
                  {slide.subtitle}
                </p>
                <button className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                  {slide.cta}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* navigation arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default Hero;
