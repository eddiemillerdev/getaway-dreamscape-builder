
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div 
        className="h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop')`
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Not sure where to go?
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Perfect. Let's find you a place to escape.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        <SearchBar compact={false} />
      </div>
    </div>
  );
};

export default Hero;
