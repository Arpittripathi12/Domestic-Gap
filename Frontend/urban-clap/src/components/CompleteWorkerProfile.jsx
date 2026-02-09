import React, { useState, useEffect } from 'react';
import { User, Briefcase, Star, CheckCircle, XCircle, Clock, ArrowRight, Package, Ban } from 'lucide-react';
import axiosInstance from '../axiosInstance';
import { showsuccess,showerror } from '../react-toastify';
// Stats Dashboard Component
function StatsDashboard({ stats, onNavigate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div 
        onClick={() => onNavigate('ratings')}
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Rating</p>
            <p className="text-2xl font-bold text-gray-800">{stats.rating.toFixed(1)}</p>
          </div>
          <Star className="text-yellow-500" size={32} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">{stats.totalRatings} reviews</p>
          <ArrowRight size={16} className="text-indigo-600" />
        </div>
      </div>
      
      <div 
        onClick={() => onNavigate('completed')}
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalCompletedOrders}</p>
          </div>
          <CheckCircle className="text-green-500" size={32} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">Total orders</p>
          <ArrowRight size={16} className="text-indigo-600" />
        </div>
      </div>
      
      <div 
        onClick={() => onNavigate('all')}
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">All Orders</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
          </div>
          <Package className="text-blue-500" size={32} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">View all</p>
          <ArrowRight size={16} className="text-indigo-600" />
        </div>
      </div>
      
      <div 
        onClick={() => onNavigate('earnings')}
        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-800">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
          <Briefcase className="text-indigo-500" size={32} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">All time</p>
          <ArrowRight size={16} className="text-indigo-600" />
        </div>
      </div>
    </div>
  );
}

// Orders View Component
function OrdersView({ type, orders }) {
  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      ongoing: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const titles = {
    all: 'All Orders',
    completed: 'Completed Orders',
    cancelled: 'Cancelled Orders'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{titles[type]}</h2>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.service}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">₹{order.amount}</p>
                  {order.customerName && (
                    <p className="text-xs text-gray-500 mt-1">{order.customerName}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Ratings View Component
function RatingsView({ ratings, averageRating, totalRatings }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ratings & Reviews</h2>
      
      <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                className={i < Math.floor(averageRating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'} 
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">{totalRatings} reviews</p>
        </div>
        
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratings.filter(r => r.rating === star).length;
            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-8">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {ratings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Star size={48} className="mx-auto mb-4 opacity-50" />
            <p>No reviews yet</p>
          </div>
        ) : (
          ratings.map(review => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{review.customerName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// Provider Profile Component
function ProviderProfile({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const skillOptions = [
    'AC and Appliance Mechanic',
    'Chef',
    'Plumber',
    'Painter',
    'Carpenter',
    'Home Cleaning'
  ];

  const vehicleTypes = ['None', 'Bike', 'Scooter', 'Car', 'Van'];

  const handleSkillToggle = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.put("/api/provider/complete-profile", {
        skills: profile.skills,
        document: profile.document,
        vehicle: profile.vehicle,
        experience: profile.experience,
      });
      
      setProfile(res.data.data);
      setLoading(false);
      setIsEditing(false);
      showsuccess('Profile updated successfully!');
    } catch (error) {
      console.error("Failed to update profile", error);
      setLoading(false);
      showerror('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Note: If you need to revert changes, you'll need to store original profile
    // or refetch from the server
  };

  const getVerificationBadge = () => {
    switch(profile.verificationStatus) {
      case 'approved':
        return <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle size={16} /> Verified</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-600 text-sm"><XCircle size={16} /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 text-yellow-600 text-sm"><Clock size={16} /> Pending</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <User size={40} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Provider Profile</h1>
            <div className="mt-1">{getVerificationBadge()}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skillOptions.map(skill => (
                <label
                  key={skill}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${
                    profile.skills.includes(skill)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!isEditing && 'pointer-events-none opacity-75'}`}
                >
                  <input
                    type="checkbox"
                    checked={profile.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Experience (years) *
            </label>
            <input
              type="number"
              name="experience"
              value={profile.experience}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="0"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter years of experience"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aadhar Number *
            </label>
            <input
              type="text"
              name="document.aadhar"
              value={profile.document.aadhar}
              onChange={handleInputChange}
              disabled={!isEditing}
              maxLength="12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter 12-digit Aadhar"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vehicle Type (Optional)
            </label>
            <select
              name="vehicle.type"
              value={profile.vehicle.type}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select vehicle type</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vehicle Number {profile.vehicle.type && profile.vehicle.type !== 'None' && '*'}
            </label>
            <input
              type="text"
              name="vehicle.number"
              value={profile.vehicle.number}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter vehicle registration number"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function CompleteWorkerProfile() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [profile, setProfile] = useState({
    providerId: '',
    skills: [''],
    experience: 0,
    document: { aadhar: '' },
    verificationStatus: '',
    vehicle: { type: '', number: '' }
  });

  const fetchProvider = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/getprovider");
      console.log(res);
      const provider = res.data.data;  
      setProfile({
        providerId: provider.providerId || "",
        skills: provider.skills || [""],
        experience: provider.experience || "",
        document: {
          aadhar: provider.document?.aadhar || "",
        },
        verificationStatus: provider.verificationStatus || "",
        vehicle: {
          type: provider.vehicle || "",
          number: provider.vehicleNumber || "",
        },
      });
    } catch (err) {
      console.error("Failed to load provider profile", err);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  const stats = {
    rating: 4.5,
    totalRatings: 127,
    totalCompletedOrders: 89,
    totalOrders: 101,
    totalEarnings: 45670
  };

  const allOrders = [
    { id: '1001', service: 'Plumbing - Pipe Repair', status: 'completed', amount: 500, date: '2024-12-15', customerName: 'Rajesh Kumar' },
    { id: '1002', service: 'Carpentry - Cabinet Installation', status: 'completed', amount: 1200, date: '2024-12-14', customerName: 'Priya Sharma' },
    { id: '1003', service: 'Plumbing - Bathroom Fitting', status: 'cancelled', amount: 800, date: '2024-12-13', customerName: 'Amit Singh' },
    { id: '1004', service: 'Carpentry - Door Repair', status: 'completed', amount: 600, date: '2024-12-12', customerName: 'Neha Gupta' },
    { id: '1005', service: 'Plumbing - Kitchen Sink', status: 'ongoing', amount: 450, date: '2024-12-16', customerName: 'Suresh Patel' }
  ];

  const ratings = [
    { id: 1, customerName: 'Rajesh Kumar', rating: 5, comment: 'Excellent work! Very professional and punctual.', date: '2024-12-15' },
    { id: 2, customerName: 'Priya Sharma', rating: 4, comment: 'Good service, but took slightly longer than expected.', date: '2024-12-14' },
    { id: 3, customerName: 'Neha Gupta', rating: 5, comment: 'Highly skilled worker. Will hire again!', date: '2024-12-12' }
  ];

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {currentView === 'dashboard' && (
          <>
            <StatsDashboard stats={stats} onNavigate={handleNavigate} />
            <ProviderProfile profile={profile} setProfile={setProfile} />
          </>
        )}

        {currentView === 'all' && (
          <>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Dashboard
            </button>
            <OrdersView type="all" orders={allOrders} />
          </>
        )}

        {currentView === 'completed' && (
          <>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Dashboard
            </button>
            <OrdersView type="completed" orders={allOrders.filter(o => o.status === 'completed')} />
          </>
        )}

        {currentView === 'cancelled' && (
          <>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Dashboard
            </button>
            <OrdersView type="cancelled" orders={allOrders.filter(o => o.status === 'cancelled')} />
          </>
        )}

        {currentView === 'ratings' && (
          <>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Dashboard
            </button>
            <RatingsView 
              ratings={ratings} 
              averageRating={stats.rating} 
              totalRatings={stats.totalRatings} 
            />
          </>
        )}

        {currentView === 'earnings' && (
          <>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Dashboard
            </button>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Earnings Overview</h2>
              <div className="text-center py-12">
                <Briefcase size={64} className="mx-auto text-indigo-500 mb-4" />
                <p className="text-5xl font-bold text-gray-800 mb-2">₹{stats.totalEarnings.toLocaleString()}</p>
                <p className="text-gray-600">Total Earnings</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

