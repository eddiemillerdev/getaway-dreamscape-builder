
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Host {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

interface ContactHostModalProps {
  open: boolean;
  onClose: () => void;
  host: Host | null;
  propertyId: string;
  propertyTitle: string;
}

const ContactHostModal = ({ open, onClose, host, propertyId, propertyTitle }: ContactHostModalProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !host) return;

    setSending(true);
    try {
      // Find or create conversation
      let { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('participant_1', user.id)
        .eq('participant_2', host.id)
        .eq('property_id', propertyId)
        .single();

      if (!conversation) {
        const { data: newConversation, error: convError } = await supabase
          .from('conversations')
          .insert({
            participant_1: user.id,
            participant_2: host.id,
            property_id: propertyId
          })
          .select('id')
          .single();

        if (convError) throw convError;
        conversation = newConversation;
      }

      // Send message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: message
        });

      if (messageError) throw messageError;

      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the host.',
      });

      setMessage('');
      onClose();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (!host) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Host</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarImage src={host.avatar_url} />
              <AvatarFallback>
                {host.first_name?.charAt(0)}{host.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{host.first_name} {host.last_name}</p>
              <p className="text-sm text-gray-600">Host of {propertyTitle}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Your message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message to the host..."
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactHostModal;
