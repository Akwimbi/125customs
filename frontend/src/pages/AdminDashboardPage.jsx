// frontend/src/pages/AdminDashboardPage.jsx
// 125Customs Admin Dashboard Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 156,
    totalQuotes: 43,
    revenue: 2450000,
    pendingOrders: 12,
    lowStock: 5,
    newCustomers: 8
  });
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-156', customer: 'John Kamau', date: '2024-01-20', status: 'processing', total: 12500 },
    { id: 'ORD-155', customer: 'ABC Ltd', date: '2024-01-19', status: 'shipped', total: 78000 },
    { id: 'ORD-154', customer: 'Sarah Wanjiku', date: '2024-01-18', status: 'delivered', total: 4500 }
  ]);
  const [recentQuotes, setRecentQuotes] = useState([
    { id: 43, company: 'XYZ Corp', title: 'Asset Tags', status: 'pending', date: '2024-01-20', amount: 65000 },
    { id: 42, company: 'Tech Solutions', title: 'Industrial Labels', status: 'approved', date: '2024-01-19', amount: 120000 }
  ]);

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
      'cancelled': { variant: 'red', label: 'Cancelled' },
      'approved': { variant: 'blue', label: 'Approved' },
      'rejected': { variant: 'red', label: 'Rejected' },
      'completed': { variant: 'green', label: 'Completed' }
    };
    const config = statusMap[status] || { variant: 'gray', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-4">
            <Button
              as={Link}
              to="/admin/orders"
              variant="outline"
              size="md"
            >
              Manage Orders
            </Button>
            <Button
              as={Link}
              to="/admin/quotes"
              variant="outline"
              size="md"
            >
              Manage Quotes
            </Button>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-red-600"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
              <p className="text-gray-600 text-sm">Total Orders</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.totalQuotes}</p>
              <p className="text-gray-600 text-sm">Total Quotes</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">KES {(stats.revenue / 1000000).toFixed(1)}M</p>
              <p className="text-gray-600 text-sm">Revenue</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
              <p className="text-gray-600 text-sm">Low Stock</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.newCustomers}</p>
              <p className="text-gray-600 text-sm">New Customers</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {['overview', 'orders', 'quotes', 'products', 'customers'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-red-600 text-red-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card variant="default">
              <Card.Header>
                <h3 className="font-semibold">Recent Orders</h3>
              </Card.Header>
              <Card.Body padding="md">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-sm font-medium mt-1">KES {order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  as={Link}
                  to="/admin/orders"
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                >
                  View All Orders
                </Button>
              </Card.Body>
            </Card>

            {/* Recent Quotes */}
            <Card variant="default">
              <Card.Header>
                <h3 className="font-semibold">Recent Quotes</h3>
              </Card.Header>
              <Card.Body padding="md">
                <div className="space-y-4">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{quote.company}</p>
                        <p className="text-sm text-gray-600">{quote.title}</p>
                        <p className="text-xs text-gray-500">{quote.date}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(quote.status)}
                        <p className="text-sm font-medium mt-1">KES {quote.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  as={Link}
                  to="/admin/quotes"
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                >
                  View All Quotes
                </Button>
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card variant="default">
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">All Orders</h3>
                <Button
                  as={Link}
                  to="/admin/orders"
                  variant="primary"
                  size="sm"
                >
                  Manage Orders
                </Button>
              </div>
            </Card.Header>
            <Card.Body padding="md">
              <p className="text-gray-600">Click "Manage Orders" to view full order management interface.</p>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'quotes' && (
          <Card variant="default">
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">All Quotes</h3>
                <Button
                  as={Link}
                  to="/admin/quotes"
                  variant="primary"
                  size="sm"
                >
                  Manage Quotes
                </Button>
              </div>
            </Card.Header>
            <Card.Body padding="md">
              <p className="text-gray-600">Click "Manage Quotes" to view full quote management interface.</p>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'products' && (
          <Card variant="default" padding="lg">
            <h3 className="font-semibold mb-4">Product Management</h3>
            <p className="text-gray-600 mb-4">Manage your product catalog, inventory, and pricing.</p>
            <Button
              as={Link}
              to="/admin/products"
              variant="primary"
            >
              Go to Product Management
            </Button>
          </Card>
        )}

        {activeTab === 'customers' && (
          <Card variant="default" padding="lg">
            <h3 className="font-semibold mb-4">Customer Management</h3>
            <p className="text-gray-600 mb-4">View and manage B2B customer accounts.</p>
            <Button
              as={Link}
              to="/admin/customers"
              variant="primary"
            >
              Go to Customer Management
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
