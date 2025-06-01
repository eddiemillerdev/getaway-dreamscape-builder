
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Experience {
  id: string;
  title: string;
  description: string;
  experience_type: string;
  duration_hours: number;
  max_participants: number;
  price_per_person: number;
  meeting_point: string;
  requirements: string[];
  included_items: string[];
  destination: {
    name: string;
    country: string;
    state_province: string;
  };
}

interface ExperienceImage {
  image_url: string;
  is_primary: boolean;
}

const Experience = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [images, setImages] = useState<ExperienceImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchExperience();
    }
  }, [id]);

  const fetchExperience = async () => {
    try {
      const { data: experienceData, error: experienceError } = await supabase
        .from('experiences')
        .select(`
          *,
          destination:destinations(name, country, state_province)
        `)
        .eq('id', id)
        .single();

      if (experienceError) throw experienceError;

      const { data: imagesData, error: imagesError } = await supabase
        .from('experience_images')
        .select('*')
        .eq('experience_id', id)
        .order('display_order');

      if (imagesError) throw imagesError;

      setExperience(experienceData);
      setImages(imagesData || []);
    } catch (error) {
      console.error('Error fetching experience:', error);
      toast({
        title: 'Error',
        description: 'Could not load experience details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Experience not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryImage = images.find(img => img.is_primary) || images[0];
  const imageUrl = primaryImage?.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
          <p className="text-gray-600">
            {experience.destination?.name}, {experience.destination?.state_province}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img 
              src={imageUrl}
              alt={experience.title}
              className="w-full h-96 object-cover rounded-xl"
            />
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">About this experience</h2>
              <p className="text-gray-700 mb-6">{experience.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900">Duration</h3>
                  <p className="text-gray-600">{experience.duration_hours} hours</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Group size</h3>
                  <p className="text-gray-600">Up to {experience.max_participants} people</p>
                </div>
              </div>

              {experience.included_items && experience.included_items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">What's included</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {experience.included_items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.requirements && experience.requirements.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {experience.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <span className="text-2xl font-bold">${experience.price_per_person}</span>
                <span className="text-gray-600"> per person</span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Meeting point</p>
                <p className="text-gray-900">{experience.meeting_point}</p>
              </div>

              <button className="w-full bg-rose-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-rose-700 transition-colors">
                Book Experience
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Experience;
