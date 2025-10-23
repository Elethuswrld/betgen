
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Login from './Login';
import App from '../App'; // Assuming your main app component is App.tsx

const Auth = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return user ? <App /> : <Login />;
};

export default Auth;
