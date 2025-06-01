
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HostRequestModalProps {
  open: boolean;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

const HostRequestModal = ({ open, onClose, onRequestSubmitted }: HostRequestModalProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please tell us why you want to become a host.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('host_requests')
        .insert({
          user_id: user?.id,
          request_message: message,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Request Submitted',
        description: 'Your host application has been submitted for review.',
      });

      onRequestSubmitted();
      onClose();
      setMessage('');
    } catch (error: any) {
      console.error('Error submitting host request:', error);
      
      if (error.code === '23505') {
        toast({
          title: 'Request Already Exists',
          description: 'You have already submitted a host application.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to submit host request',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request to be a Host</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Why do you want to become a host?</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience, properties, or what motivates you to become a host..."
              rows={5}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostRequestModal;
