
import { Home, Bed, Hotel, Plane } from 'lucide-react';

const propertyTypes = [
  {
    id: 1,
    icon: Home,
    title: 'Entire homes',
    description: 'Comfortable private places, with room for friends or family.'
  },
  {
    id: 2,
    icon: Bed,
    title: 'Unique stays',
    description: 'Spaces that are more than just a place to sleep.'
  },
  {
    id: 3,
    icon: Hotel,
    title: 'Hotels & more',
    description: 'Comfortable rooms with hotel service and local character.'
  },
  {
    id: 4,
    icon: Plane,
    title: 'Adventures',
    description: 'Multi-day experiences led by local experts.'
  }
];

const PropertyTypes = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Explore different types of stays</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {propertyTypes.map((type) => (
          <div 
            key={type.id}
            className="group cursor-pointer p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
                <type.icon className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyTypes;
