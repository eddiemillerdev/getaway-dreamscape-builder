
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TripDetailsModal from '@/components/modals/TripDetailsModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import PaymentPreferencesModal from '@/components/modals/PaymentPreferencesModal';
import HostRequestModal from '@/components/modals/HostRequestModal';
import WalletSection from '@/components/WalletSection';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import TripsTab from '@/components/dashboard/TripsTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import MessagesTab from '@/components/dashboard/MessagesTab';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const {
    activeTab,
    setActiveTab,
    bookings,
    profile,
    loading,
    selectedBooking,
    setSelectedBooking,
    editProfileOpen,
    setEditProfileOpen,
    paymentPreferencesOpen,
    setPaymentPreferencesOpen,
    hostRequestOpen,
    setHostRequestOpen,
    fetchData,
    handleViewDetails
  } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div className="lg:col-span-3 h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your bookings and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar
              profile={profile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setPaymentPreferencesOpen={setPaymentPreferencesOpen}
              setHostRequestOpen={setHostRequestOpen}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'trips' && (
              <TripsTab
                bookings={bookings}
                onViewDetails={handleViewDetails}
              />
            )}

            {activeTab === 'messages' && <MessagesTab />}

            {activeTab === 'wallet' && <WalletSection />}

            {activeTab === 'profile' && (
              <ProfileTab
                profile={profile}
                setEditProfileOpen={setEditProfileOpen}
                setHostRequestOpen={setHostRequestOpen}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <TripDetailsModal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        onSuccess={() => {
          setEditProfileOpen(false);
          fetchData();
        }}
      />

      <PaymentPreferencesModal
        open={paymentPreferencesOpen}
        onClose={() => setPaymentPreferencesOpen(false)}
      />

      <HostRequestModal
        open={hostRequestOpen}
        onClose={() => setHostRequestOpen(false)}
        onSuccess={() => {
          setHostRequestOpen(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default Dashboard;
