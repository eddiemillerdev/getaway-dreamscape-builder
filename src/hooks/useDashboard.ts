
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardBooking, TripDetailsBooking } from '@/types/booking';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  is_host: boolean;
}

export const useDashboard = () => {
  const [activeTab, setActiveTab] = useState('trips');
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<TripDetailsBooking | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [paymentPreferencesOpen, setPaymentPreferencesOpen] = useState(false);
  const [hostRequestOpen, setHostRequestOpen] = useState(false);
  
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) {
      console.log('No user found, redirecting to auth');
      return;
    }

    setLoading(true);
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          guests,
          total_amount,
          status,
          properties(id, title, address)
        `)
        .eq('guest_id', user.id)
        .order('check_in_date', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (booking: DashboardBooking) => {
    try {
      // Fetch full booking details for the modal
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          guests,
          total_amount,
          status,
          nights,
          special_requests,
          properties(id, title, address, property_type, host_id)
        `)
        .eq('id', booking.id)
        .single();

      if (error) throw error;
      
      setSelectedBooking(data as TripDetailsBooking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  return {
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
  };
};
