
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Experience {
  id: string;
  title: string;
  price_per_person: number;
  duration_hours: number;
  destination: {
    name: string;
    country: string;
    state_province: string;
  };
  experience_images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          id,
          title,
          price_per_person,
          duration_hours,
          destination:destinations(name, country, state_province),
          experience_images(image_url, is_primary)
        `)
        .eq('is_active', true);

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Unique Experiences</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-64 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Unique Experiences</h1>
        <p className="text-lg text-gray-600 mb-12">Create unforgettable memories with our curated experiences around the world.</p>
        
        {experiences.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No experiences available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later or browse our properties.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => {
              const primaryImage = experience.experience_images?.find(img => img.is_primary) || experience.experience_images?.[0];
              const imageUrl = primaryImage?.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
              const location = experience.destination ? `${experience.destination.name}, ${experience.destination.state_province}` : 'Location';

              return (
                <Link 
                  key={experience.id}
                  to={`/experience/${experience.id}`}
                  className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative">
                    <img 
                      src={imageUrl}
                      alt={experience.title}
                      className="w-full h-64 object-cover rounded-xl group-hover:shadow-lg transition-shadow duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 rounded-md text-xs font-medium">
                      {experience.duration_hours} hours
                    </div>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">{location}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-900">4.8</span>
                        <span className="text-sm text-gray-600">(124)</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mt-1">{experience.title}</h3>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      From ${experience.price_per_person} <span className="text-sm font-normal text-gray-600">per person</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExperiencesPage;
