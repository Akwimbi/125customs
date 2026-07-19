// frontend/src/pages/B2BDashboardPage.jsx
// 125Customs B2B Dashboard Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function B2BDashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [quotes, setQuotes] = useState([
    { id: 1, title: 'Asset Tags - Office Equipment', status: 'pending', date: '2024-01-15', amount: 45000 },
    { id: 2, title: 'Industrial Labels - Warehouse', status: 'approved', date: '2024-01-10', amount: 78000 },
    { id: 3, title: 'Custom Engraving - Awards', status: 'completed', date: '2023-12-20', amount: 32000 }
  ]);
  const [orders, setOrders] = useState([
    { id: 'ORD-001', date: '2024-01-20', status: 'processing', total: 45000 },
    { id: 'ORD-002', date: '2024-01-18', status: 'shipped', total: 78000 }
  ]);

  useEffect(() => {
    if (!isAuthenticated || (user?.audienceType !== 'b2b' && user?.audienceType !== 'both')) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { variant: 'yellow', label: 'Pending' },
      'approved': { variant: 'blue', label: 'Approved' },
      'rejected': { variant: 'red', label: 'Rejected' },
      'completed': { variant: 'green', label: 'Completed' },
      'processing': { variant: 'yellow', label: 'Processing' },
      'shipped': { variant: 'blue', label: 'Shipped' },
      'delivered': { variant: 'green', label: 'Delivered' }
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{quotes.length}</p>
              <p className="text-gray-600">Active Quotes</p>
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
              <p className="text-3xl font-bold text-green-600">KES 155,000</p>
              <p className="text-gray-600">Total Spent</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">2</p>
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
                <div className="space-y-4">
                  {quotes.slice(0, 3).map((quote) => (
                    <div key={quote.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{quote.title}</p>
                        <p className="text-sm text-gray-600">{quote.date}</p>
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
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
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
                  to="/b2b/orders"
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                >
                  View All Orders
                </Button>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Quote #</th>
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Amount</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">Q-{quote.id}</td>
                        <td className="py-3">{quote.title}</td>
                        <td className="py-3">{quote.date}</td>
                        <td className="py-3">KES {quote.amount.toLocaleString()}</td>
                        <td className="py-3">{getStatusBadge(quote.status)}</td>
                        <td className="py-3">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card variant="default">
            <Card.Header>
              <h3 className="font-semibold">All Orders</h3>
            </Card.Header>
            <Card.Body padding="md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Order #</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Total</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{order.id}</td>
                        <td className="py-3">{order.date}</td>
                        <td className="py-3">KES {order.total.toLocaleString()}</td>
                        <td className="py-3">{getStatusBadge(order.status)}</td>
                        <td className="py-3">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <p className="text-gray-900">{user?.industry || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                <p className="text-gray-900">{user?.taxId || 'Not set'}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-6">
              Edit Profile
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default B2BDashboardPage;
