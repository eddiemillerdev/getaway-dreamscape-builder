
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Destinations from '@/components/Destinations';
import PropertyTypes from '@/components/PropertyTypes';
import FeaturedListings from '@/components/FeaturedListings';
import Experiences from '@/components/Experiences';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <div className="mt-16">
        <Destinations />
        <PropertyTypes />
        <FeaturedListings />
        <Experiences />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
