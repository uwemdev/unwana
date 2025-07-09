import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useICPWallet } from "@/hooks/useICPWallet";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Save } from "lucide-react";

export function ProfileSettings() {
  const { user, isConnected } = useICPWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    display_name: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, display_name, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          username: data.username || "",
          display_name: data.display_name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const validateUsername = (username: string) => {
    const trimmed = username.trim();
    
    // Length validation
    if (trimmed.length < 3 || trimmed.length > 7) {
      return "Username must be between 3-7 characters";
    }
    
    // Special characters validation
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    
    // Blocked usernames
    const blockedUsernames = ['admin', 'root', 'user', 'test', 'null', 'void', 'api', 'www', 'ftp', 'mail'];
    if (blockedUsernames.includes(trimmed.toLowerCase())) {
      return "This username is not allowed";
    }
    
    return null;
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Validate display_name if it's being used as username
      if (profile.display_name) {
        const usernameError = validateUsername(profile.display_name);
        if (usernameError) {
          toast({
            title: "Invalid Username",
            description: usernameError,
            variant: "destructive",
          });
          return;
        }
      }

      const { error } = await supabase
        .from("users")
        .update({
          display_name: profile.display_name.trim() || null,
          bio: profile.bio.trim() || null,
          avatar_url: profile.avatar_url.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Please connect your wallet to access profile settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {profile.display_name?.charAt(0) || profile.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{profile.display_name || profile.username}</h3>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Username cannot be changed after account creation.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Username (3-7 characters)</Label>
            <Input
              id="display_name"
              placeholder="Enter your username"
              value={profile.display_name}
              onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
              maxLength={7}
            />
            <p className="text-xs text-muted-foreground">
              Only letters, numbers, and underscores allowed. No special names like 'admin', 'root', etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              placeholder="https://example.com/avatar.jpg"
              value={profile.avatar_url}
              onChange={(e) => setProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
            />
          </div>
        </div>

        <Button 
          onClick={updateProfile} 
          disabled={loading}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}