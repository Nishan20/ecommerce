import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../store/slices/productSlice";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, categories, isLoading } = useSelector((state) => state.product);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "",
    images: [],
  });

  useEffect(() => {
    dispatch(getAllProducts({ limit: 1000 }));
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("categoryId", form.categoryId);
    data.append("stock", form.stock);
    for (let i = 0; i < form.images.length; i++) {
      data.append("images", form.images[i]);
    }
    if (form.id) {
      dispatch(updateProduct({ productId: form.id, productData: data }));
    } else {
      dispatch(createProduct(data));
    }
    setForm({ id: null, name: "", description: "", price: "", categoryId: "", stock: "", images: [] });
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      stock: product.stock,
      images: [],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Product" : "Create Product"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="mt-1 w-full"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {form.id ? "Update" : "Create"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">${p.price}</td>
                    <td className="px-4 py-2">{p.stock}</td>
                    <td className="px-4 py-2">{p.category?.name}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
