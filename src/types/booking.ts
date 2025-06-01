
export interface BookingProperty {
  id: string;
  title: string;
  address: string;
  property_type?: string;
  host_id?: string;
}

export interface DashboardBooking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  status: string;
  properties: BookingProperty;
}

export interface TripDetailsBooking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  status: string;
  nights?: number;
  special_requests?: string;
  properties: {
    id: string;
    title: string;
    property_type: string;
    address: string;
    host_id: string;
  };
}
