
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ExperiencesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Unique Experiences</h1>
        <p className="text-lg text-gray-600">Create unforgettable memories with our curated experiences.</p>
      </div>
      <Footer />
    </div>
  );
};

export default ExperiencesPage;
