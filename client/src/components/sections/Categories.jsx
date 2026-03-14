import { Link } from "react-router-dom";
import {
  Monitor,
  ShoppingBag,
  Smartphone,
  Home as HomeIcon,
  Gift,
} from "lucide-react";

const fixedCategories = [
  { id: 1, name: "Electronics", icon: Monitor },
  { id: 2, name: "Fashion", icon: ShoppingBag },
  { id: 3, name: "Mobiles", icon: Smartphone },
  { id: 4, name: "Home", icon: HomeIcon },
  { id: 5, name: "Accessories", icon: Gift },
];

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Shop by Category
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our top categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 px-4 md:px-0">
        {fixedCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 mb-2 rounded-full bg-primary-100 group-hover:bg-primary transition-colors">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
