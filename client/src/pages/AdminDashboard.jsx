import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchStats } from "../store/slices/adminSlice";
import { Link } from "react-router-dom";
import { Users, Box, ShoppingCart, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser: user } = useSelector((state) => state.auth);
  const { stats, recentOrders, recentUsers, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/");
      return;
    }
    dispatch(fetchStats());
  }, [dispatch, user, navigate]);

  if (isLoading || !stats) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-gray-500">Users</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <Box className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <p className="text-gray-500">Products</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <ShoppingCart className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <p className="text-gray-500">Orders</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-gray-500">Revenue</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            {recentOrders?.length > 0 ? (
              <ul className="space-y-2">
                {recentOrders.map((order) => (
                  <li key={order.id} className="flex justify-between items-center">
                    <span>#{order.id.slice(0,8)}</span>
                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent orders</p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            {recentUsers?.length > 0 ? (
              <ul className="space-y-2">
                {recentUsers.map((user) => (
                  <li key={user.id} className="flex justify-between items-center">
                    <span>{user.name}</span>
                    <span className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
