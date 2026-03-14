import { Link } from "react-router-dom";

const deals = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Up to 70% off on selected fashion items",
    image: "https://images.unsplash.com/photo-1560185127-6a2f1763aec5?w=800",
    url: "/products?category=Fashion",
  },
  {
    id: 2,
    title: "Gadget Fest",
    description: "Latest electronics at unbeatable prices",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    url: "/products?category=Electronics",
  },
  {
    id: 3,
    title: "Home Makeover",
    description: "Decor and furniture deals up to 60% off",
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800",
    url: "/products?category=Home & Garden",
  },
];

const Deals = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Hot Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              to={deal.url}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-xl font-semibold text-white">{deal.title}</h3>
                <p className="text-sm text-gray-200">{deal.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;
