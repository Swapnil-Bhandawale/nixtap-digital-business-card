import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Bell, UserPlus, Eye, Calendar, Info } from 'lucide-react';
import { apiClient } from '../../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get('/notifications');
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 502) {
          setErrorMsg('The Notifications API is not yet available.');
        } else {
          setErrorMsg('Failed to load notifications.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'lead': return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'view': return <Eye className="w-5 h-5 text-blue-600" />;
      case 'appointment': return <Calendar className="w-5 h-5 text-purple-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h2>
          <p className="text-gray-500">Stay updated on your digital card activity.</p>
        </div>
        {notifications.length > 0 && (
          <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Mark all as read
          </button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse">Loading notifications...</div>
          ) : errorMsg ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Feature Unavailable</h3>
              <p className="text-gray-500 max-w-md">{errorMsg}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
              <p className="text-gray-500 max-w-md">You don't have any new notifications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification, i) => (
                <div key={i} className={`p-6 flex items-start hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-brand-50/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(notification.date).toLocaleString()}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-brand-600 ml-4 mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
