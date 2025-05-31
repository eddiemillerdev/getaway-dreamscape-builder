
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
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
        {images.slice(1, 5).map((image, index) => (
          <img
            key={index}
            src={image.image_url}
            alt={`${title} ${index + 1}`}
            className="w-full h-40 md:h-[11.5rem] object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyImages;
