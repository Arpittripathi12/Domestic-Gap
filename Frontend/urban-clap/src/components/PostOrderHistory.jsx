import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Clock, MapPin, User, Phone, Package, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import axiosInstance from '../axiosInstance';
import ProfileDropDown from './ProfileDropDown';
import { useNavigate } from 'react-router-dom';
const PastOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const navigate=useNavigate();

  // Fetch past orders (completed and cancelled) from API
  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/getmybookings');
        
        if (response.data.status === 200) {
          // Filter only completed and cancelled bookings
          const pastBookings = response.data.data.filter(
            booking => booking.status === 'completed' || booking.status === 'cancelled'
          );
          setOrders(pastBookings);
        }
      } catch (error) {
        console.error('Error fetching past orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPastOrders();
  }, []);



  const handleBookAgain=(order)=>{
    console.log("ORDER DETAILS ",order);
    navigate(`/services/${order.service}`)
  
  }

  // Transform API data to display format
  const transformedOrders = useMemo(() => 
    orders.map(order => ({
      id: order.bookingId,
      service: order.category,
      serviceman: order.providerId?.providerId ? 
        `${order.providerId.providerId.firstName} ${order.providerId.providerId.lastName}` : null,
      servicemanPhone: order.providerId?.providerId?.contactNumber || null,
      date: new Date(order.scheduledDate).toLocaleDateString('en-IN'),
      time: order.scheduledTime,
      status: order.status,
      address: `${order.serviceAddress.street}, ${order.serviceAddress.landmark}, ${order.serviceAddress.city}, ${order.serviceAddress.state}`,
      amount: `₹${order.price}`,
      completedDate: order.completedAt ? new Date(order.completedAt).toLocaleDateString('en-IN') : null,
      completedTime: order.completedAt ? new Date(order.completedAt).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : null,
      cancellationReason: order.cancellationReason || 'No reason provided',
      description: order.jobDescription,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      raw: order
    })), [orders]
  );

  const statusConfig = {
    all: { 
      label: 'All Orders', 
      color: 'bg-gray-100 text-gray-700', 
      count: transformedOrders.length 
    },
    completed: { 
      label: 'Completed', 
      color: 'bg-green-100 text-green-700', 
      count: transformedOrders.filter(o => o.status === 'completed').length 
    },
    cancelled: { 
      label: 'Cancelled', 
      color: 'bg-red-100 text-red-700', 
      count: transformedOrders.filter(o => o.status === 'cancelled').length 
    }
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = transformedOrders.filter(order => {
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (order.serviceman && order.serviceman.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });

    // Sort orders
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.raw.scheduledDate) - new Date(a.raw.scheduledDate));
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.raw.price - a.raw.price);
    } else if (sortBy === 'status') {
      filtered.sort((a, b) => a.status.localeCompare(b.status));
    }

    return filtered;
  }, [transformedOrders, selectedStatus, searchQuery, sortBy]);

  const getStatusIcon = (status) => {
    return status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading past orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg rounded-b-[60px] rounded-bl-[40px] rounded-br-[40px]">
        {/* Left Text Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white">My Booking History</h1>
          <p className="text-green-100">
            View your past completed and cancelled orders
          </p>
        </div>

        {/* Right Profile Dropdown */}
        <div className="flex items-center">
          <ProfileDropDown />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`p-6 rounded-full shadow-md transition-all transform hover:scale-105 ${
                selectedStatus === key
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-200'
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              <div className="text-3xl font-bold mb-2">{config.count}</div>
              <div className={`text-sm font-medium ${selectedStatus === key ? 'text-green-50' : 'text-gray-600'}`}>
                {config.label}
              </div>
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, service, or serviceman name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all' 
                  ? 'You have no past orders yet' 
                  : 'Try adjusting your filters or search query'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-l-4"
                style={{ borderLeftColor: order.status === 'completed' ? '#10b981' : '#ef4444' }}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${order.status === 'completed' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-red-500'} rounded-lg flex items-center justify-center text-white font-bold shadow-md`}>
                          {order.service.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-800">{order.service}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig[order.status].color}`}>
                              {getStatusIcon(order.status)}
                              {statusConfig[order.status].label}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-green-600" />
                              <span className="font-medium">Booked: {order.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span>{order.time}</span>
                            </div>
                            {order.status === 'completed' && order.completedDate && (
                              <>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="font-medium">Completed: {order.completedDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-green-600" />
                                  <span>{order.completedTime}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Amount</div>
                        <div className={`text-2xl font-bold ${order.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.amount}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">ID: {order.id}</div>
                      </div>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-green-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-600" />
                            Service Location
                          </h4>
                          <p className="text-gray-600 bg-green-50 p-3 rounded-lg">{order.address}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-600" />
                            Service Provider
                          </h4>
                          {order.serviceman ? (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-gray-800 font-medium">{order.serviceman}</p>
                              {order.servicemanPhone && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Phone className="w-4 h-4 text-green-600" />
                                  <p className="text-gray-600 text-sm">{order.servicemanPhone}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-red-50 p-3 rounded-lg">
                              <p className="text-red-600 font-medium">No serviceman was assigned</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {order.description && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Job Description</h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.description}</p>
                        </div>
                      )}

                      {order.status === 'cancelled' && order.cancellationReason && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            Cancellation Reason
                          </h4>
                          <p className="text-gray-600 bg-red-50 p-3 rounded-lg">{order.cancellationReason}</p>
                        </div>
                      )}

                      <div className="flex gap-3 mt-6 flex-wrap">
                        {order.status === 'completed' && (
                          <>
                            <button className="flex-1 min-w-[200px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                              onClick={() => handleBookAgain(order)}>
                              
                              Book Again
                            </button>
                            <button className="flex-1 min-w-[200px] bg-white border-2 border-green-500 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all">
                              Rate Service
                            </button>
                          </>
                        )}
                        {order.status === 'cancelled' && (
                          <button className="flex-1 min-w-[200px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg
                          
                          "
                            onClick={() => handleBookAgain(order)}
                          >
                            Book Again
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PastOrdersPage;  