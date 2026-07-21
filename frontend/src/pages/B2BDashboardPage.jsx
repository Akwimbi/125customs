// frontend/src/pages/B2BDashboardPage.jsx
// 125Customs B2B Dashboard Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { quotesAPI, ordersAPI } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function B2BDashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || (user?.audienceType !== 'b2b' && user?.audienceType !== 'both')) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quotesRes, ordersRes] = await Promise.all([
        quotesAPI.getByUser(),
        ordersAPI.getByUser()
      ]);
      if (quotesRes.success) setQuotes(quotesRes.quotes || []);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load your dashboard. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { variant: 'warning', label: 'Pending' },
      'approved': { variant: 'info', label: 'Approved' },
      'rejected': { variant: 'danger', label: 'Rejected' },
      'paid': { variant: 'info', label: 'Paid' },
      'processing': { variant: 'warning', label: 'Processing' },
      'shipped': { variant: 'info', label: 'Shipped' },
      'delivered': { variant: 'success', label: 'Delivered' },
      'cancelled': { variant: 'danger', label: 'Cancelled' }
    };
    const config = statusMap[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const totalSpent = orders
    .filter(o => ['paid', 'delivered', 'shipped'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const pendingActions = quotes.filter(q => q.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">B2B Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.companyName || user?.name}</p>
          </div>
          <Button
            as={Link}
            to="/quote-request"
            variant="primary"
            size="lg"
          >
            Request New Quote
          </Button>
        </div>

        {error && <p className="text-red-600 mb-6">{error}</p>}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{quotes.length}</p>
              <p className="text-gray-600">Total Quotes</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-gray-600">Orders</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">KES {totalSpent.toLocaleString()}</p>
              <p className="text-gray-600">Total Spent</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{pendingActions}</p>
              <p className="text-gray-600">Pending Actions</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {['overview', 'quotes', 'orders', 'profile'].map((tab) => (
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
            {/* Recent Quotes */}
            <Card variant="default">
              <Card.Header>
                <h3 className="font-semibold">Recent Quotes</h3>
              </Card.Header>
              <Card.Body padding="md">
                {quotes.length === 0 && <p className="text-gray-500 text-sm">No quotes yet.</p>}
                <div className="space-y-4">
                  {quotes.slice(0, 3).map((quote) => (
                    <div key={quote.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{quote.projectDescription}</p>
                        <p className="text-sm text-gray-600">{new Date(quote.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(quote.status)}
                        <p className="text-sm font-medium mt-1">
                          {quote.totalAmount ? `KES ${Number(quote.totalAmount).toLocaleString()}` : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  as={Link}
                  to="/b2b/quotes"
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                >
                  View All Quotes
                </Button>
              </Card.Body>
            </Card>

            {/* Recent Orders */}
            <Card variant="default">
              <Card.Header>
                <h3 className="font-semibold">Recent Orders</h3>
              </Card.Header>
              <Card.Body padding="md">
                {orders.length === 0 && <p className="text-gray-500 text-sm">No orders yet.</p>}
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <p className="text-sm font-medium mt-1">KES {Number(order.totalAmount).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'quotes' && (
          <Card variant="default">
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">All Quotes</h3>
                <Button
                  as={Link}
                  to="/quote-request"
                  variant="primary"
                  size="sm"
                >
                  New Quote
                </Button>
              </div>
            </Card.Header>
            <Card.Body padding="md">
              {quotes.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No quotes yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Quote #</th>
                        <th className="text-left py-2">Project</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => (
                        <tr key={quote.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">{quote.quoteNumber}</td>
                          <td className="py-3">{quote.projectDescription}</td>
                          <td className="py-3">{new Date(quote.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">{quote.totalAmount ? `KES ${Number(quote.totalAmount).toLocaleString()}` : '—'}</td>
                          <td className="py-3">{getStatusBadge(quote.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card variant="default">
            <Card.Header>
              <h3 className="font-semibold">All Orders</h3>
            </Card.Header>
            <Card.Body padding="md">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm py-4">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Order #</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Total</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">{order.orderNumber}</td>
                          <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">KES {Number(order.totalAmount).toLocaleString()}</td>
                          <td className="py-3">{getStatusBadge(order.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {activeTab === 'profile' && (
          <Card variant="default" padding="lg">
            <h3 className="font-semibold mb-6">Company Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <p className="text-gray-900">{user?.companyName || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{user?.phone || 'Not set'}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default B2BDashboardPage;
