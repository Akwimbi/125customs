// frontend/src/pages/AdminQuotesPage.jsx
// 125Customs Admin Quotes Management Page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

function AdminQuotesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [quotes, setQuotes] = useState([
    { id: 43, company: 'XYZ Corp', contact: 'Peter Mwangi', email: 'peter@xyz.co.ke', title: 'Asset Tags - Office Equipment', status: 'pending', date: '2024-01-20', amount: 65000, items: 500 },
    { id: 42, company: 'Tech Solutions Ltd', contact: 'Alice Wambui', email: 'alice@tech.co.ke', title: 'Industrial Labels - Warehouse', status: 'approved', date: '2024-01-19', amount: 120000, items: 2000 },
    { id: 41, company: 'ABC Manufacturing', contact: 'John Kamau', email: 'john@abc.co.ke', title: 'Custom Engraving - Awards', status: 'rejected', date: '2024-01-18', amount: 35000, items: 100 },
    { id: 40, company: 'HealthCare Ltd', contact: 'Mary Njeri', email: 'mary@health.co.ke', title: 'Medical Equipment Tags', status: 'completed', date: '2024-01-15', amount: 89000, items: 750 }
  ]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
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

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      quote.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (quoteId, newStatus) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: newStatus } : quote
    ));
    alert(`Quote ${quoteId} status updated to ${newStatus}`);
  };

  const handleSendQuote = (quote) => {
    alert(`Quote email sent to ${quote.email} for quote #${quote.id}`);
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
              placeholder="Search by company, title, or email..."
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
                <option value="completed">Completed</option>
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

        {/* Quotes Table */}
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
                    <td className="py-3 px-4 font-medium">Q-{quote.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{quote.company}</p>
                        <p className="text-sm text-gray-600">{quote.contact}</p>
                        <p className="text-xs text-gray-500">{quote.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p>{quote.title}</p>
                      <p className="text-sm text-gray-600">{quote.items} items</p>
                    </td>
                    <td className="py-3 px-4">{quote.date}</td>
                    <td className="py-3 px-4 font-medium">KES {quote.amount.toLocaleString()}</td>
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
                              onClick={() => handleUpdateStatus(quote.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleUpdateStatus(quote.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {quote.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendQuote(quote)}
                          >
                            Send Quote
                          </Button>
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

        {/* Quote Details Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card variant="default" padding="lg" className="max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quote Details - Q-{selectedQuote.id}</h2>
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
                    <p><strong>Company:</strong> {selectedQuote.company}</p>
                    <p><strong>Contact:</strong> {selectedQuote.contact}</p>
                    <p><strong>Email:</strong> {selectedQuote.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Quote Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Project:</strong> {selectedQuote.title}</p>
                    <p><strong>Items:</strong> {selectedQuote.items}</p>
                    <p><strong>Amount:</strong> KES {selectedQuote.amount.toLocaleString()}</p>
                    <p><strong>Date:</strong> {selectedQuote.date}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedQuote.status)}</p>
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
                      onClick={() => {
                        handleUpdateStatus(selectedQuote.id, 'rejected');
                        setSelectedQuote(null);
                      }}
                      className="flex-1"
                    >
                      Reject Quote
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleUpdateStatus(selectedQuote.id, 'approved');
                        setSelectedQuote(null);
                      }}
                      className="flex-1"
                    >
                      Approve Quote
                    </Button>
                  </>
                )}
                {selectedQuote.status === 'approved' && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleSendQuote(selectedQuote);
                      setSelectedQuote(null);
                    }}
                    className="flex-1"
                  >
                    Send Quote to Customer
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {['pending', 'approved', 'rejected', 'completed'].map((status) => (
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
      </div>
    </div>
  );
}

export default AdminQuotesPage;
