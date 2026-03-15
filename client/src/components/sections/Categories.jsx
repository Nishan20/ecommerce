import { Link } from "react-router-dom";
import {
  Monitor, 
  ShoppingBag, 
  Home,
  ShoppingCart
} from "lucide-react";

const fixedCategories = [
  { id: 1, name: "Electronics", icon: Monitor, slug: "electronics" },
  { id: 2, name: "Fashion", icon: ShoppingBag, slug: "fashion" },
  { id: 3, name: "Home", icon: Home, slug: "home" },
  { id: 4, name: "Grocery", icon: ShoppingCart, slug: "grocery" },
];

const Categories = () => {
  return (
    <section className="py-20 bg-ecommerce['page-bg']">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Shop by Category
          </h2>
          <p className="text-xl md:text-2xl text-ecommerce-text max-w-2xl mx-auto leading-relaxed">
            Discover amazing products in your favorite categories
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {fixedCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative flex flex-col items-center p-8 bg-ecommerce-card rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-4 hover:scale-105 transition-all duration-500 border border-ecommerce-border hover:border-ecommerce-primary hover:ring-4 ring-ecommerce-primary/20 overflow-hidden h-full"
              >
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ecommerce-primary/10 to-ecommerce-primary/5 p-5 mb-6 group-hover:bg-ecommerce-primary/20 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:rotate-6">
                    <Icon className="w-12 h-12 text-ecommerce-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-ecommerce-heading group-hover:text-ecommerce-primary transition-colors text-center mb-2 px-2">
                    {cat.name}
                  </h3>
                  <p className="text-ecommerce-text text-sm opacity-80 text-center">
                    Explore collection
                  </p>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-t from-ecommerce-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
