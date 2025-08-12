import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfile from '../features/users/UserProfile';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Render the profile only if authenticated con contenedor estilizado
  return isAuthenticated ? (
    <section className="min-h-[70vh]">
      <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md p-4 sm:p-6 shadow-soft">
        <UserProfile />
      </div>
    </section>
  ) : null;
};

export default ProfilePage;
