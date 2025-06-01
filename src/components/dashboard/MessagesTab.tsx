
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  property_id: string;
  created_at: string;
  properties: {
    title: string;
  };
  profiles: {
    first_name: string;
    last_name: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
  };
}

const MessagesTab = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_1,
          participant_2,
          property_id,
          created_at,
          properties(title),
          profiles!conversations_participant_2_fkey(first_name, last_name)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch last message for each conversation
      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (conversation) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conversation,
            last_message: lastMessage
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          profiles!messages_sender_id_fkey(first_name, last_name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = (data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
        sender: {
          first_name: msg.profiles?.first_name || 'Unknown',
          last_name: msg.profiles?.last_name || 'User'
        }
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation);
      fetchConversations(); // Refresh to update last message
    } catch (error) {
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

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participant_1 === user?.id 
      ? conversation.profiles 
      : conversation.profiles;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 border-b transition-colors ${
                        selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {otherParticipant?.first_name} {otherParticipant?.last_name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.properties?.title}
                              </p>
                            </div>
                          </div>
                          {conversation.last_message && (
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {conversation.last_message.content}
                            </p>
                          )}
                        </div>
                        {conversation.last_message && (
                          <span className="text-xs text-gray-400">
                            {format(new Date(conversation.last_message.created_at), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="lg:col-span-2">
        <CardContent className="p-0 h-full">
          {selectedConversation ? (
            <div className="flex flex-col h-[560px]">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium">
                  {conversations.find(c => c.id === selectedConversation)?.properties?.title}
                </h3>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {format(new Date(message.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 min-h-0 resize-none"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;
