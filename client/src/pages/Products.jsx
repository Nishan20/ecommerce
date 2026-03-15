import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as Slider from "@radix-ui/react-slider";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, getAllCategories } from "../store/slices/productSlice";
import ProductCard from "../components/ui/ProductCard";
import { Star, Search, Filter, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, totalProducts, totalPages, currentPage, isLoading } = useSelector(
    (state) => state.product
  );
  
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: parseInt(searchParams.get("minPrice")) || 0,
    maxPrice: parseInt(searchParams.get("maxPrice")) || 1000,
    sort: searchParams.get("sort") || "newest",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [price, setPrice] = useState([0, 1000]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: searchParams.get("page") || 1,
      limit: 12,
    };
    
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort) params.sort = filters.sort;
    
    dispatch(getAllProducts(params));
  }, [dispatch, searchParams, filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== '' && v !== 0 && v !== undefined) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
    handleFilterChange("minPrice", newPrice[0]);
    handleFilterChange("maxPrice", newPrice[1]);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      sort: "newest",
    });
    setPrice([0, 1000]);
    setSearchParams({});
  };

  return (
    <div className="pt-20 min-h-screen bg-ecommerce['page-bg']">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <h1 className="text-4xl font-bold text-ecommerce-heading">All Products</h1>
            <span className="text-2xl text-ecommerce-text font-medium">
              ({totalProducts} products found)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-3 px-6 py-3 bg-ecommerce-card border border-ecommerce-border shadow-lg hover:shadow-xl hover:bg-ecommerce-primary/5 text-ecommerce-text hover:text-ecommerce-primary rounded-xl transition-all duration-300 lg:hidden font-medium"
          >
            <Filter className="w-5 h-5" />
            Filters & Sort
          </button>
        </div>

        <div className="flex gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-80 flex-shrink-0`}>
            <div className="bg-ecommerce-card rounded-2xl shadow-xl p-8 border border-ecommerce-border hover:shadow-2xl transition-all duration-300 sticky top-8 h-fit">
              <h2 className="text-2xl font-bold text-ecommerce-heading mb-8 flex items-center gap-3">
                <Filter className="w-7 h-7" />
                Filters
              </h2>

              {/* Search */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-ecommerce-heading mb-4">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-ecommerce-placeholder" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="Search products, brands..."
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all placeholder:text-ecommerce-placeholder shadow-sm"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-ecommerce-heading mb-4">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-ecommerce-heading mb-4">
                  Price Range
                </label>
                <div className="space-y-4">
                  <Slider.Root
                    className="relative h-5 flex-1 w-full cursor-pointer"
                    defaultValue={[filters.minPrice, filters.maxPrice]}
                    onValueChange={handlePriceChange}
                    max={1000}
                    step={10}
                    value={[filters.minPrice, filters.maxPrice]}
                  >
                    <Slider.Track className="bg-ecommerce['page-bg'] relative grow rounded-full h-[6px] shadow-sm">
                      <Slider.Range className="absolute bg-gradient-to-r from-ecommerce-primary to-blue-600 rounded-full h-full shadow-lg" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-6 h-6 bg-ecommerce-primary border-4 border-white rounded-full shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-200 focus:outline-none focus:ring-4 ring-ecommerce-primary/50" />
                    <Slider.Thumb className="block w-6 h-6 bg-ecommerce-primary border-4 border-white rounded-full shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-200 focus:outline-none focus:ring-4 ring-ecommerce-primary/50 ml-1" />
                  </Slider.Root>
                  <div className="flex justify-between text-sm font-bold text-ecommerce-text">
                    <span>${filters.minPrice}</span>
                    <span>${filters.maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-10">
                <label className="block text-lg font-bold text-ecommerce-heading mb-4">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-ecommerce-border bg-ecommerce-card text-ecommerce-text focus:ring-4 ring-ecommerce-primary/20 focus:border-ecommerce-primary focus:shadow-lg transition-all shadow-sm cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-4 px-6 bg-gradient-to-r from-ecommerce-primary to-blue-600 hover:from-ecommerce['primary-hover'] hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 font-bold text-lg flex items-center gap-2 justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-8 flex items-center px-6 py-3 bg-ecommerce-card rounded-xl shadow-lg hover:shadow-xl hover:bg-ecommerce-primary/5 border border-ecommerce-border transition-all duration-300"
            >
              <Filter className="w-5 h-5 mr-3" />
              Show Filters ({Object.values(filters).filter(Boolean).length})
            </button>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : products?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-3 rounded-xl border hover:bg-ecommerce-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-12 h-12 rounded-xl font-bold shadow-sm transition-all ${
                            isActive
                              ? "bg-ecommerce-primary text-white shadow-md hover:shadow-lg scale-105"
                              : "border hover:bg-ecommerce['page-bg'] hover:shadow-md hover:scale-105 bg-ecommerce-card border-ecommerce-border text-ecommerce-text"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-xl border hover:bg-ecommerce-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32">
                <div className="w-32 h-32 mx-auto mb-8 bg-ecommerce-card rounded-3xl p-8 shadow-2xl flex items-center justify-center">
                  <Search className="w-20 h-20 text-ecommerce-text/50" />
                </div>
                <h2 className="text-3xl font-bold text-ecommerce-heading mb-4">
                  No products found
                </h2>
                <p className="text-xl text-ecommerce-text mb-8 max-w-md mx-auto">
                  Try adjusting your search or filter settings
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-ecommerce-primary hover:bg-ecommerce['primary-hover'] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
