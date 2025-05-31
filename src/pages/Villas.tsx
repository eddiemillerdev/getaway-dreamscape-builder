
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Villas = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Luxury Villas</h1>
        <p className="text-lg text-gray-600">Discover our collection of premium villas around the world.</p>
      </div>
      <Footer />
    </div>
  );
};

export default Villas;
