import React, { useEffect, useState } from 'react';
import { accomodationAPI } from '../../../configs/api';
import { Download, RefreshCw, Users, Phone, Calendar, UserCheck, Building, Edit3, Trash2, Check, X, Search, Filter } from 'lucide-react';

const SuperAdminAccomodation = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', book: '', member: '' });

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await accomodationAPI.getAllAccomodations();
      if (res?.data?.accomodations) {
        setBookings(res.data.accomodations);
        setFilteredBookings(res.data.accomodations);
      } else if (Array.isArray(res?.data)) {
        setBookings(res.data);
        setFilteredBookings(res.data);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (err) {
      console.error('Failed to fetch accomodations', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search
  useEffect(() => {
    let filtered = bookings;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(booking => booking.book === filterType);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.name?.toLowerCase().includes(term) ||
        booking.phone?.includes(term) ||
        (booking.teamid || booking.teamId || booking.team)?.toString().toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  }, [searchTerm, filterType, bookings]);

  const startEdit = (booking) => {
    setEditingId(booking._id || booking.id);
    setEditForm({
      name: booking.name || '',
      phone: booking.phone || '',
      book: booking.book || '',
      member: booking.member || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', phone: '', book: '', member: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    try {
      const payload = { ...editForm };
      await accomodationAPI.updateAccomodation(id, payload);
      setBookings(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, ...payload } : b));
      cancelEdit();
    } catch (err) {
      console.error('Failed to update booking', err);
      alert(err?.response?.data?.message || err.message || 'Failed to update booking');
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await accomodationAPI.deleteAccomodation(id);
      setBookings(prev => prev.filter(b => !(b._id === id || b.id === id)));
    } catch (err) {
      console.error('Failed to delete booking', err);
      alert(err?.response?.data?.message || err.message || 'Failed to delete booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const exportToCSV = () => {
    const headers = ['Team ID', 'Name', 'Phone', 'Booking', 'Members', 'Created At'];
    const csvData = bookings.map(b => [
      b.teamid || b.teamId || b.team,
      b.name,
      b.phone,
      b.book,
      b.member,
      new Date(b.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accommodation-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getBookingTypeColor = (type) => {
    switch (type) {
      case 'RICR Hostel': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'NIST Hostel': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading accommodation bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Accommodation Management</h1>
              <p className="text-gray-600">Manage and monitor all team accommodation bookings</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchBookings}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">RICR Hostel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.book === 'RICR Hostel').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">NIST Hostel</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.book === 'NIST Hostel').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.reduce((sum, b) => sum + (parseInt(b.member) || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, phone, or team ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="all">All Types</option>
                <option value="RICR Hostel">RICR Hostel</option>
                <option value="NIST Hostel">NIST Hostel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {bookings.length === 0 
                  ? "There are no accommodation bookings at the moment." 
                  : "No bookings match your search criteria."}
              </p>
              <button
                onClick={fetchBookings}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Team & Contact Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Accommodation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date & Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => {
                    const id = booking._id || booking.id;
                    const isEditing = editingId === id;
                    return (
                      <tr key={id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                         

                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleEditChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  placeholder="Full Name"
                                />
                                <input
                                  name="phone"
                                  value={editForm.phone}
                                  onChange={handleEditChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  placeholder="Phone Number"
                                />
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-gray-900">{booking.name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  {booking.phone}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {isEditing ? (
                            <select
                              name="book"
                              value={editForm.book}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <option value="RICR Hostel">RICR Hostel</option>
                              <option value="NIST Hostel">NIST Hostel</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getBookingTypeColor(booking.book)}`}>
                              <Building className="w-4 h-4 mr-1.5" />
                              {booking.book}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-400" />
                            {isEditing ? (
                              <input
                                name="member"
                                type="number"
                                value={editForm.member}
                                onChange={handleEditChange}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                min="1"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-gray-900">
                                {booking.member} {booking.member == 1 ? 'member' : 'members'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </div>
                           
                            </div>

                            <div className="flex items-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => saveEdit(id)}
                                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm"
                                    title="Save"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow-sm"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(booking)}
                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                                    title="Edit"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteBooking(id)}
                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAccomodation;