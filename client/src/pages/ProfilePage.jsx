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

  // Render the profile only if authenticated
  return isAuthenticated ? <UserProfile /> : null;
};

export default ProfilePage;
