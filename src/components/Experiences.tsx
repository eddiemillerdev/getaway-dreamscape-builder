
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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

const Experiences = () => {
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
        .eq('is_active', true)
        .limit(4);

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
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Unique experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-64 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Unique experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </section>
  );
};

export default Experiences;
