// frontend/src/pages/QuoteListPage.jsx
// 125Customs B2B Quote List Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { quotesAPI } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function QuoteListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !(user?.audienceType === 'b2b' || user?.audienceType === 'both')) {
      navigate('/login');
      return;
    }
    fetchQuotes();
  }, [isAuthenticated, user, navigate]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await quotesAPI.getByUser();
      if (res.success) {
        setQuotes(res.quotes || []);
      }
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
      setError('Failed to load your quotes. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { variant: 'warning', label: 'Pending' },
      'approved': { variant: 'info', label: 'Approved' },
      'rejected': { variant: 'danger', label: 'Rejected' }
    };
    const config = statusMap[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredQuotes = quotes
    .filter(quote => filterStatus === 'all' || quote.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-high': return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'amount-low': return (a.totalAmount || 0) - (b.totalAmount || 0);
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

        {loading && <p className="text-gray-500">Loading your quotes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Quotes List */}
        {!loading && !error && (
          filteredQuotes.length === 0 ? (
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
                          <h3 className="font-semibold text-lg">{quote.projectDescription}</h3>
                          {getStatusBadge(quote.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Quote #:</span> {quote.quoteNumber}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(quote.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span> {quote.quantity}
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span> {quote.totalAmount ? `KES ${Number(quote.totalAmount).toLocaleString()}` : 'Pending review'}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )
        )}

        {/* Quote Details Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card variant="default" padding="lg" className="max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedQuote.quoteNumber}</h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Project:</strong> {selectedQuote.projectDescription}</p>
                <p><strong>Quantity:</strong> {selectedQuote.quantity}</p>
                {selectedQuote.materialPreference && <p><strong>Material:</strong> {selectedQuote.materialPreference}</p>}
                <p><strong>Amount:</strong> {selectedQuote.totalAmount ? `KES ${Number(selectedQuote.totalAmount).toLocaleString()}` : 'Not yet set - awaiting review'}</p>
                <p><strong>Requested:</strong> {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
                <p><strong>Valid until:</strong> {new Date(selectedQuote.validUntil).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedQuote.status)}</p>
                {selectedQuote.notes && <p><strong>Notes:</strong> {selectedQuote.notes}</p>}
              </div>
              <Button variant="outline" onClick={() => setSelectedQuote(null)} className="w-full mt-6">
                Close
              </Button>
            </Card>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && (
          <Card variant="default" padding="md" className="mt-8">
            <div className="grid grid-cols-3 gap-4 text-center">
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
                <p className="text-2xl font-bold text-red-600">
                  {quotes.filter(q => q.status === 'rejected').length}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default QuoteListPage;
