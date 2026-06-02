import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import BottomNav from '@/components/BottomNav';
import { Copy, LogOut, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();

  if (!authLoading && !user) { navigate('/'); return null; }
  if (isLoading || !profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-6 pt-12">
        <h1 className="text-2xl font-bold font-heading">Profile</h1>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <div className="bg-card rounded-2xl p-5 card-shadow">
          <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl font-heading mb-3">
            {profile.name.charAt(0)}
          </div>
          <h2 className="font-bold font-heading text-lg">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.phone}</p>
        </div>

        <div className="bg-card rounded-2xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-primary" />
            <p className="font-semibold text-sm">Referral Code</p>
          </div>
          <div className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
            <span className="font-mono font-bold">{profile.referral_code}</span>
            <button onClick={() => navigator.clipboard.writeText(profile.referral_code)} className="text-primary">
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Earn UGX 50,000 for each friend who joins</p>
        </div>

        {profile.financing_status !== 'none' && (
          <div className="bg-card rounded-2xl p-5 card-shadow">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Financing Status</p>
            <p className="font-semibold capitalize mt-1">{profile.financing_status}</p>
          </div>
        )}

        <button onClick={handleLogout}
          className="w-full h-11 bg-destructive/10 text-destructive font-semibold rounded-2xl flex items-center justify-center gap-2">
          <LogOut size={16} /> Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
