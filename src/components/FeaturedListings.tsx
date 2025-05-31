
import { Star } from 'lucide-react';

const listings = [
  {
    id: 1,
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, Colorado',
    price: '$120',
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
    isNew: true
  },
  {
    id: 2,
    title: 'Oceanfront Villa',
    location: 'Malibu, California',
    price: '$350',
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
    isNew: false
  },
  {
    id: 3,
    title: 'Historic Downtown Loft',
    location: 'Charleston, South Carolina',
    price: '$85',
    rating: 4.7,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
    isNew: false
  },
  {
    id: 4,
    title: 'Lakeside Retreat',
    location: 'Lake Tahoe, Nevada',
    price: '$200',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
    isNew: true
  }
];

const FeaturedListings = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Featured stays</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div 
            key={listing.id}
            className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative">
              <img 
                src={listing.image}
                alt={listing.title}
                className="w-full h-64 object-cover rounded-lg group-hover:shadow-lg transition-shadow duration-300"
              />
              {listing.isNew && (
                <div className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 rounded-md text-xs font-medium">
                  New
                </div>
              )}
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{listing.location}</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-900">{listing.rating}</span>
                  <span className="text-sm text-gray-600">({listing.reviews})</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-1">{listing.title}</h3>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {listing.price} <span className="text-sm font-normal text-gray-600">night</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedListings;
