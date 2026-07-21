// frontend/src/pages/AdminQuotesPage.jsx
// 125Customs Admin Quotes Management Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { quotesAPI } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

function AdminQuotesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchQuotes();
  }, [isAuthenticated, user, navigate]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await quotesAPI.getAllAdmin();
      if (res.success) {
        setQuotes(res.quotes || []);
      }
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
      setError('Failed to load quotes. Is the backend running?');
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

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      quote.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.projectDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = async (quote) => {
    const amountStr = window.prompt(
      `Set the total amount for this quote (KES), for ${quote.companyName}:`,
      quote.totalAmount || ''
    );
    if (amountStr === null) return; // cancelled
    const totalAmount = parseFloat(amountStr);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    try {
      setActionLoading(true);
      const res = await quotesAPI.approve(quote.id, { totalAmount });
      if (res.success) {
        setQuotes(prev => prev.map(q => q.id === quote.id ? res.quote : q));
        setSelectedQuote(null);
      }
    } catch (err) {
      console.error('Failed to approve quote:', err);
      alert('Failed to approve quote.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (quote) => {
    const reason = window.prompt(`Reason for rejecting this quote from ${quote.companyName}:`, '');
    if (reason === null) return; // cancelled
    try {
      setActionLoading(true);
      const res = await quotesAPI.reject(quote.id, reason);
      if (res.success) {
        setQuotes(prev => prev.map(q => q.id === quote.id ? res.quote : q));
        setSelectedQuote(null);
      }
    } catch (err) {
      console.error('Failed to reject quote:', err);
      alert('Failed to reject quote.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Quotes</h1>
            <p className="text-gray-600">Review and respond to B2B quote requests</p>
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
              label="Search Quotes"
              type="text"
              placeholder="Search by company, project, or email..."
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
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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

        {loading && <p className="text-gray-500">Loading quotes...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Quotes Table */}
        {!loading && !error && (
          <Card variant="default">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4">Quote #</th>
                    <th className="text-left py-3 px-4">Company</th>
                    <th className="text-left py-3 px-4">Project</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{quote.quoteNumber}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{quote.companyName}</p>
                          <p className="text-sm text-gray-600">{quote.contactPerson}</p>
                          <p className="text-xs text-gray-500">{quote.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p>{quote.projectDescription}</p>
                        <p className="text-sm text-gray-600">{quote.quantity} items</p>
                      </td>
                      <td className="py-3 px-4">{new Date(quote.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium">
                        {quote.totalAmount ? `KES ${Number(quote.totalAmount).toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(quote.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuote(quote)}
                          >
                            View
                          </Button>
                          {quote.status === 'pending' && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleApprove(quote)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleReject(quote)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No quotes found matching your criteria.</p>
              </div>
            )}
          </Card>
        )}

        {/* Quote Details Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card variant="default" padding="lg" className="max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quote Details - {selectedQuote.quoteNumber}</h2>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Company Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Company:</strong> {selectedQuote.companyName}</p>
                    <p><strong>Contact:</strong> {selectedQuote.contactPerson}</p>
                    <p><strong>Email:</strong> {selectedQuote.email}</p>
                    <p><strong>Phone:</strong> {selectedQuote.phone}</p>
                    {selectedQuote.kraPin && <p><strong>KRA PIN:</strong> {selectedQuote.kraPin}</p>}
                    {selectedQuote.agpoCertNumber && <p><strong>AGPO Cert:</strong> {selectedQuote.agpoCertNumber}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Quote Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Project:</strong> {selectedQuote.projectDescription}</p>
                    <p><strong>Quantity:</strong> {selectedQuote.quantity}</p>
                    {selectedQuote.materialPreference && <p><strong>Material:</strong> {selectedQuote.materialPreference}</p>}
                    <p><strong>Amount:</strong> {selectedQuote.totalAmount ? `KES ${Number(selectedQuote.totalAmount).toLocaleString()}` : 'Not yet set'}</p>
                    <p><strong>Date:</strong> {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedQuote.status)}</p>
                    {selectedQuote.notes && <p><strong>Notes:</strong> {selectedQuote.notes}</p>}
                  </div>
                </div>
              </div>

              {/* Quote Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedQuote(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedQuote.status === 'pending' && (
                  <>
                    <Button
                      variant="danger"
                      disabled={actionLoading}
                      onClick={() => handleReject(selectedQuote)}
                      className="flex-1"
                    >
                      Reject Quote
                    </Button>
                    <Button
                      variant="primary"
                      disabled={actionLoading}
                      onClick={() => handleApprove(selectedQuote)}
                      className="flex-1"
                    >
                      Approve Quote
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Stats Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {['pending', 'approved', 'rejected'].map((status) => (
              <Card key={status} variant="default" padding="md">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {quotes.filter(q => q.status === status).length}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{status}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminQuotesPage;
