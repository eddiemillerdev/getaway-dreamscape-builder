
const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
    distance: '7,441 kilometers away'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop',
    distance: '10,878 kilometers away'
  },
  {
    id: 3,
    name: 'Banff, Canada',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
    distance: '3,214 kilometers away'
  },
  {
    id: 4,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
    distance: '8,956 kilometers away'
  }
];

const Destinations = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Popular destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((destination) => (
          <div 
            key={destination.id}
            className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">{destination.name}</h3>
                <p className="text-sm text-gray-200">{destination.distance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Destinations;
