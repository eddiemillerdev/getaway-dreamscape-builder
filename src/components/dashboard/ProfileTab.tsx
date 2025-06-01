
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, UserPlus } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  is_host: boolean;
}

interface ProfileTabProps {
  profile: Profile | null;
  setEditProfileOpen: (open: boolean) => void;
  setHostRequestOpen: (open: boolean) => void;
}

const ProfileTab = ({ profile, setEditProfileOpen, setHostRequestOpen }: ProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          My Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <p className="text-gray-900">{profile?.first_name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <p className="text-gray-900">{profile?.last_name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{profile?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
          </div>
        </div>
        
        {profile?.bio && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <p className="text-gray-900">{profile.bio}</p>
          </div>
        )}
        
        <div className="flex space-x-4">
          <Button onClick={() => setEditProfileOpen(true)}>
            Edit Profile
          </Button>
          
          {!profile?.is_host && (
            <Button
              variant="outline"
              onClick={() => setHostRequestOpen(true)}
              className="flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Request to be a Host
            </Button>
          )}
          
          {profile?.is_host && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 py-2 px-4">
              Host Account
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
