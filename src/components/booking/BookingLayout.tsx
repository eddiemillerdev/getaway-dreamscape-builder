
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingHeader from '@/components/booking/BookingHeader';

interface BookingLayoutProps {
  children: React.ReactNode;
}

const BookingLayout = ({ children }: BookingLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BookingHeader />
        {children}
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingLayout;
