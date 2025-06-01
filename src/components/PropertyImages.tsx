
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface PropertyImage {
  image_url: string;
  is_primary: boolean;
}

interface PropertyImagesProps {
  images: PropertyImage[];
  title: string;
}

const PropertyImages = ({ images, title }: PropertyImagesProps) => {
  const primaryImage = images.find(img => img.is_primary) || images[0];
  const secondaryImages = images.slice(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
      <div className="md:col-span-2">
        {primaryImage && (
          <img
            src={primaryImage.image_url}
            alt={title}
            className="w-full h-80 md:h-96 object-cover"
          />
        )}
      </div>
      <div className="md:col-span-2">
        {secondaryImages.length > 0 ? (
          <Carousel className="w-full h-80 md:h-96">
            <CarouselContent>
              {secondaryImages.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image.image_url}
                    alt={`${title} ${index + 2}`}
                    className="w-full h-80 md:h-96 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="w-full h-80 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No additional images</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyImages;
