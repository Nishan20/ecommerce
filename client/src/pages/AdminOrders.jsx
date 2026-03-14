import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../store/slices/orderSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ orderId: id, orderStatus: status }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete order?")) {
      dispatch(deleteOrder(id));
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th class="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-2">{o.id.slice(0,8)}</td>
                  <td className="px-4 py-2">{o.user?.name}</td>
                  <td className="px-4 py-2">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(o.id)}
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
  );
};

export default AdminOrders;
