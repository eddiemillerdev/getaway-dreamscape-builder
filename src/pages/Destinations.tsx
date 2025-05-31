
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Destinations = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Popular Destinations</h1>
        <p className="text-lg text-gray-600">Explore amazing destinations for your next getaway.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Destinations;
