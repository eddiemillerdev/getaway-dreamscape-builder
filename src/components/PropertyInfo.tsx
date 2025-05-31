
import { Home, Bed, Wifi } from 'lucide-react';

interface Property {
  property_type: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
}

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Property Info */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {property.property_type} hosted by John
            </h2>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>{property.max_guests} guests</span>
              <span>{property.bedrooms} bedrooms</span>
              <span>{property.bathrooms} bathrooms</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        </div>

        <div className="border-t border-b py-6 space-y-4">
          <div className="flex items-start space-x-4">
            <Home className="h-6 w-6 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium">Entire {property.property_type}</h3>
              <p className="text-gray-600 text-sm">You'll have the {property.property_type} to yourself.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Bed className="h-6 w-6 text-gray-400 mt-1" />
            <div>
              <h3 className="font-medium">Enhanced Clean</h3>
              <p className="text-gray-600 text-sm">This property is committed to our enhanced cleaning protocol.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
        <div className="grid grid-cols-2 gap-4">
          {property.amenities?.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Wifi className="h-5 w-5 text-gray-400" />
              <span className="text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;
