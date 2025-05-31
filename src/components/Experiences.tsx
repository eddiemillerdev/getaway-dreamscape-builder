
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const experiences = [
  {
    id: 1,
    title: 'Wine Tasting in Napa Valley',
    location: 'Napa Valley, California',
    price: '$85',
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    duration: '4 hours'
  },
  {
    id: 2,
    title: 'Sunset Sailing Experience',
    location: 'Key West, Florida',
    price: '$120',
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    duration: '3 hours'
  },
  {
    id: 3,
    title: 'Mountain Hiking Adventure',
    location: 'Aspen, Colorado',
    price: '$65',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    duration: '6 hours'
  },
  {
    id: 4,
    title: 'Cooking Class with Chef',
    location: 'San Francisco, California',
    price: '$95',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    duration: '3 hours'
  }
];

const Experiences = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Unique experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {experiences.map((experience) => (
          <Link 
            key={experience.id}
            to={`/experience/${experience.id}`}
            className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative">
              <img 
                src={experience.image}
                alt={experience.title}
                className="w-full h-64 object-cover rounded-xl group-hover:shadow-lg transition-shadow duration-300"
              />
              <div className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 rounded-md text-xs font-medium">
                {experience.duration}
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{experience.location}</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-900">{experience.rating}</span>
                  <span className="text-sm text-gray-600">({experience.reviews})</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-1">{experience.title}</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                From {experience.price} <span className="text-sm font-normal text-gray-600">per person</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Experiences;
