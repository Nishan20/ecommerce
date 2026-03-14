import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    text: "ShopHub made my shopping experience so easy and enjoyable! Highly recommend.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    text: "Fast delivery and great customer service. Will shop again.",
    rating: 4,
  },
  {
    id: 3,
    name: "Michael Lee",
    text: "Fantastic deals and quality products. Love the site design!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < t.rating ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{t.text}"</p>
              <p className="font-semibold">- {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
