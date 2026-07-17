// frontend/src/pages/AdminOrdersPage.jsx
// 125Customs Admin Orders Management Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Input';
import Input from '../components/ui/Input';

function AdminOrdersPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([
    { id: 'ORD-156', customer: 'John Kamau', email: 'john@example.com', date: '2024-01-20', status: 'processing', total: 12500, items: 3, payment: 'mpesa' },
    { id: 'ORD-155', customer: 'ABC Ltd', email: 'contact@abcltd.com', date: '2024-01-19', status: 'shipped', total: 78000, items: 50, payment: 'bank' },
    { id: 'ORD-154', customer: 'Sarah Wanjiku', email: 'sarah@example.com', date: '2024-01-18', status: 'delivered', total: 4500, items: 2, payment: 'mpesa' },
    { id: 'ORD-153', customer: 'Tech Solutions', email: 'hello@tech.co.ke', date: '2024-01-17', status: 'pending', total: 15000, items: 5, payment: 'card' },
    { id: 'ORD-152', customer: 'Mary Njeri', email: 'mary@example.com', date: '2024-01-16', status: 'cancelled', total: 8500, items: 1, payment: 'mpesa' }
  ]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { variant: 'yellow', label: 'Pending' },
      'processing': { variant: 'yellow', label: 'Processing' },
      'shipped': { variant: 'blue', label: 'Shipped' },
      'delivered': { variant: 'green', label: 'Delivered' },
      'cancelled': { variant: 'red', label: 'Cancelled' }
    };
    const config = statusMap[status] || { variant: 'gray', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Orders</h1>
            <p className="text-gray-600">View and update order statuses</p>
          </div>
          <Button
            as={Link}
            to="/admin/dashboard"
            variant="outline"
            size="md"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Filters */}
        <Card variant="default" padding="md" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Search Orders"
              type="text"
              placeholder="Search by order #, customer, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card variant="default">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4">Order #</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Payment</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">{order.items} items</td>
                    <td className="py-3 px-4 font-medium">KES {order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="gray">{order.payment.toUpperCase()}</Badge>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View
                        </Button>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No orders found matching your criteria.</p>
            </div>
          )}
        </Card>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card variant="default" padding="lg" className="max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Order Details - {selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{selectedOrder.payment.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="font-medium">{selectedOrder.items}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-xl text-red-600">KES {selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    alert('Invoice download started...');
                    setSelectedOrder(null);
                  }}
                  className="flex-1"
                >
                  Download Invoice
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <Card key={status} variant="default" padding="md">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === status).length}
                </p>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
