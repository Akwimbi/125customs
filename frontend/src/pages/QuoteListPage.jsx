// frontend/src/pages/QuoteListPage.jsx
// 125Customs B2B Quote List Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

function QuoteListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [quotes, setQuotes] = useState([
    { id: 1, title: 'Asset Tags - Office Equipment', status: 'pending', date: '2024-01-15', amount: 45000, items: 500 },
    { id: 2, title: 'Industrial Labels - Warehouse', status: 'approved', date: '2024-01-10', amount: 78000, items: 1000 },
    { id: 3, title: 'Custom Engraving - Awards', status: 'completed', date: '2023-12-20', amount: 32000, items: 50 },
    { id: 4, title: 'Asset Tags - IT Department', status: 'rejected', date: '2024-01-05', amount: 12000, items: 200 }
  ]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'b2b') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { variant: 'yellow', label: 'Pending' },
      'approved': { variant: 'blue', label: 'Approved' },
      'rejected': { variant: 'red', label: 'Rejected' },
      'completed': { variant: 'green', label: 'Completed' }
    };
    const config = statusMap[status] || { variant: 'gray', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredQuotes = quotes
    .filter(quote => filterStatus === 'all' || quote.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-high': return b.amount - a.amount;
        case 'amount-low': return a.amount - b.amount;
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Quotes</h1>
            <p className="text-gray-600">Track and manage your B2B quote requests</p>
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

        {/* Filters */}
        <Card variant="default" padding="md" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterStatus('all');
                  setSortBy('date-desc');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Quotes List */}
        {filteredQuotes.length === 0 ? (
          <Card variant="default" padding="lg">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No quotes found</h3>
              <p className="text-gray-600 mb-6">You haven't requested any quotes yet.</p>
              <Button
                as={Link}
                to="/quote-request"
                variant="primary"
                size="lg"
              >
                Request Your First Quote
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} variant="default" hover={true}>
                <Card.Body padding="md">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg">{quote.title}</h3>
                        {getStatusBadge(quote.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quote #:</span> Q-{quote.id}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {quote.date}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span> {quote.items}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> KES {quote.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        as={Link}
                        to={`/quotes/${quote.id}`}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                      {quote.status === 'approved' && (
                        <Button
                          variant="primary"
                          size="sm"
                        >
                          Convert to Order
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <Card variant="default" padding="md" className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {quotes.filter(q => q.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {quotes.filter(q => q.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {quotes.filter(q => q.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {quotes.filter(q => q.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default QuoteListPage;
