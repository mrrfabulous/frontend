import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { CreditCard, Train, Bell, Settings as SettingsIcon, History, LogOut } from 'lucide-react';
import { NotificationBell } from '../components/NotificationBell';
import BookingsList from '../components/BookingsList';
import PaymentHistory from './PaymentHistory';
import Settings from '../components/Settings';

const DashboardCard = ({ title, value, icon: Icon, onClick }: {
  title: string;
  value: string | number;
  icon: any;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <Icon className="w-6 h-6 text-primary-600" />
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const SidebarLink = ({ icon: Icon, label, active, onClick }: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
      active
        ? 'bg-primary-100 text-primary-600'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: CreditCard },
    { id: 'bookings', label: 'My Bookings', icon: Train },
    { id: 'payments', label: 'Payment History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-600">Welcome, {user?.firstName}</p>
        </div>

        <div className="space-y-2">
          {sections.map((section) => (
            <SidebarLink
              key={section.id}
              icon={section.icon}
              label={section.label}
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            />
          ))}

          <SidebarLink
            icon={LogOut}
            label="Logout"
            active={false}
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {sections.find((s) => s.id === activeSection)?.label}
            </h1>
            <NotificationBell />
          </div>
        </header>

        <main className="p-6">
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Active Bookings"
                value="3"
                icon={Train}
                onClick={() => setActiveSection('bookings')}
              />
              <DashboardCard
                title="Total Spent"
                value="₦45,000"
                icon={CreditCard}
                onClick={() => setActiveSection('payments')}
              />
              <DashboardCard
                title="Notifications"
                value="5"
                icon={Bell}
                onClick={() => setActiveSection('notifications')}
              />
            </div>
          )}

          {activeSection === 'bookings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
              <BookingsList />
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              <PaymentHistory />
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              {/* Add NotificationsList component here */}
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <Settings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
