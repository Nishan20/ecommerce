import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllCategories } from "../store/slices/productSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h1>
        <p className="text-muted-foreground mb-8">Browse our most popular categories and find what you need.</p>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug || category.name}`}
                className="group relative block overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">{category.name}</h2>
                  <span className="text-sm text-muted-foreground">View all</span>
                </div>
                <p className="mt-2 text-muted-foreground line-clamp-2">
                  {category.description || "Shop items in this category."}
                </p>
                <span className="mt-4 inline-flex items-center text-primary font-semibold group-hover:underline">
                  Browse
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
