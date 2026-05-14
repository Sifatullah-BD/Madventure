import React, { useState } from 'react';
import { Bell, AlertTriangle, X, CheckCircle, Info, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAllRead } = useNotifications();

    // Toggle popup
    const togglePopup = () => setIsOpen(!isOpen);

    const getIcon = (type) => {
        switch (type) {
            case 'emergency': return <AlertTriangle size={20} className="text-red-500" />;
            case 'success': return <CheckCircle size={20} className="text-green-500" />;
            default: return <Info size={20} className="text-blue-500" />;
        }
    };

    return (
        <div className="fixed bottom-48 right-0 z-50">
            {/* Popup */}
            {isOpen && (
                <div className="absolute right-[calc(100%+8px)] bottom-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-right-4 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-primary font-bold hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-bold ${notification.type === 'emergency' ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                    {notification.body}
                                                </p>
                                                <span className="text-[10px] text-gray-400 mt-2 block">
                                                    {notification.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={togglePopup}
                className="relative p-3 rounded-l-xl shadow-lg transition-all duration-300 hover:-translate-x-1 active:scale-95 group backdrop-blur-md bg-white border border-gray-100 border-r-0 text-gray-700 hover:text-primary"
            >
                <Bell size={24} className="relative z-10" />

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white z-20">
                        {unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default NotificationButton;
