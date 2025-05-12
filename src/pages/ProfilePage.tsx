import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || 'https://via.placeholder.com/150?text=Profile',
    restaurantName: 'La Belle Cuisine',
    role: 'Restaurant Manager',
    phone: '+1 (555) 123-4567',
    notificationPreferences: {
      newOrders: true,
      orderStatusChanges: true,
      dailySummary: true,
      marketingUpdates: false
    }
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would update the user's profile in Firebase here
    setTimeout(() => {
      setSaveSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple client-side validation
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // In a real application, you would update the password in Firebase here
    setPasswordError(null);
    setSaveSuccess('Password updated successfully!');
    
    // Clear form and success message after a few seconds
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => {
      setSaveSuccess(null);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-6 flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </motion.div>

      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
        >
          {saveSuccess}
        </motion.div>
      )}

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Profile Information</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleProfileUpdate}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 mb-4">
                  <img 
                    src={profileData.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Photo
                  </button>
                )}
              </div>
              
              {/* Profile Details */}
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={profileData.restaurantName}
                      onChange={(e) => setProfileData({...profileData, restaurantName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Restaurant name"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profileData.role}
                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your role"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Security</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handlePasswordUpdate}>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
              
              {passwordError && (
                <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                >
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Notification Preferences</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {[
              { id: 'newOrders', label: 'New Orders', description: 'Get notified when a new order is placed' },
              { id: 'orderStatusChanges', label: 'Order Status Changes', description: 'Get notified when an order status changes' },
              { id: 'dailySummary', label: 'Daily Summary', description: 'Receive a daily summary of your restaurant performance' },
              { id: 'marketingUpdates', label: 'Marketing & Updates', description: 'Receive marketing materials and product updates' }
            ].map((pref) => (
              <div key={pref.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={pref.id}
                    type="checkbox"
                    checked={profileData.notificationPreferences[pref.id as keyof typeof profileData.notificationPreferences]}
                    onChange={(e) => {
                      setProfileData({
                        ...profileData,
                        notificationPreferences: {
                          ...profileData.notificationPreferences,
                          [pref.id]: e.target.checked
                        }
                      });
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={pref.id} className="font-medium text-gray-700">{pref.label}</label>
                  <p className="text-gray-500">{pref.description}</p>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden"
      >
        <div className="border-b border-red-200 px-6 py-4 bg-red-50">
          <h2 className="font-bold text-lg text-red-800">Danger Zone</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Delete Account</h3>
              <p className="text-gray-500 text-sm">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}