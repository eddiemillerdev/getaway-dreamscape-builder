
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  properties: {
    id: string;
    title: string;
  };
}

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking;
}

interface Ratings {
  overall: number;
  cleanliness: number;
  accuracy: number;
  checkin: number;
  communication: number;
  location: number;
  value: number;
}

const ReviewModal = ({ open, onClose, booking }: ReviewModalProps) => {
  const [ratings, setRatings] = useState<Ratings>({
    overall: 0,
    cleanliness: 0,
    accuracy: 0,
    checkin: 0,
    communication: 0,
    location: 0,
    value: 0
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'checkin', label: 'Check-in' },
    { key: 'communication', label: 'Communication' },
    { key: 'location', label: 'Location' },
    { key: 'value', label: 'Value' }
  ];

  const handleRatingChange = (category: keyof Ratings, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmitReview = async () => {
    if (!user || ratings.overall === 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          property_id: booking.properties.id,
          booking_id: booking.id,
          reviewer_id: user.id,
          rating: ratings.overall,
          cleanliness_rating: ratings.cleanliness,
          accuracy_rating: ratings.accuracy,
          checkin_rating: ratings.checkin,
          communication_rating: ratings.communication,
          location_rating: ratings.location,
          value_rating: ratings.value,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast({
        title: 'Review Submitted',
        description: 'Thank you for your review!',
      });

      onClose();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{booking.properties.title}</h3>
          </div>

          {/* Overall Rating */}
          <StarRating
            rating={ratings.overall}
            onRatingChange={(rating) => handleRatingChange('overall', rating)}
            label="Overall Rating"
          />

          {/* Category Ratings */}
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <StarRating
                key={category.key}
                rating={ratings[category.key as keyof Ratings]}
                onRatingChange={(rating) => handleRatingChange(category.key as keyof Ratings, rating)}
                label={category.label}
              />
            ))}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Review (Optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with other guests..."
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={ratings.overall === 0 || submitting}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
