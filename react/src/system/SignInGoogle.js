// In your component file
import React from 'react';
import useAuth from './UseAuth'; // Adjust the import path as necessary

const SignInGoogle = () => {
  
    const { authState, signInWithGoogle } = useAuth();

  // Component logic and JSX

    if (authState.status === 'in') {
        return <div>Welcome, {authState.user.displayName}</div>;
    }
    if (authState.status === 'out') {
        return <button onClick={signInWithGoogle}>Sign in with Google</button>;
    }
    
    
};

export default SignInGoogle;
