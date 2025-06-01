
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle } from 'lucide-react';
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
  other_participant: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    is_read: boolean;
  };
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

const MessagesTab = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

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
          properties:property_id(title),
          messages(content, created_at, is_read)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch other participant details
      const conversationsWithParticipants = await Promise.all(
        (data || []).map(async (conv) => {
          const otherParticipantId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
          
          const { data: participant } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', otherParticipantId)
            .single();

          return {
            ...conv,
            other_participant: participant,
            last_message: conv.messages?.[0] || null
          };
        })
      );

      setConversations(conversationsWithParticipants);
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
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
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
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
          {/* Conversations List */}
          <div className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conversation.other_participant?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {conversation.other_participant?.first_name?.charAt(0)}
                          {conversation.other_participant?.last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conversation.other_participant?.first_name} {conversation.other_participant?.last_name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {conversation.properties?.title}
                        </p>
                        {conversation.last_message && (
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.last_message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="border rounded-lg flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-3 border-b bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConversationData?.other_participant?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {selectedConversationData?.other_participant?.first_name?.charAt(0)}
                        {selectedConversationData?.other_participant?.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {selectedConversationData?.other_participant?.first_name} {selectedConversationData?.other_participant?.last_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedConversationData?.properties?.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.sender_id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {format(new Date(message.created_at), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 text-sm"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim() || sending} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesTab;
