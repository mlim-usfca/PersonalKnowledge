'use client';

import React from 'react';

// Define types for your component's props and state if needed
type AuthModalProps = {
  // Define props here if needed, for example:
  onClose: () => void;
  mode: 'signup' | 'login';
  onToggleMode: () => void;
};

const AuthModal: React.FC<AuthModalProps> = (props) => {
  // Implement any state or functions here
  // const { onClose } = props;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignUp = () => {
    console.log('sign up', email, password);
  };
  const handleLogIn = () => {
    console.log('login', email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-10">
      <div className="relative mx-auto mx-4 px-7 py-6 border w-96 shadow-lg rounded-[12px] bg-white">
        <button
          className="absolute top-0 right-0 p-3"
          type="submit"
          onClick={props.onClose}
        >
          <svg
            className="h-6 w-6 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-3xl font-bold leading-6 font-medium text-gray-900 mt-5 mb-3">
          {props.mode === 'signup' ? 'Sign Up' : 'Log In'}
        </h3>
        <form
          className="bg-white rounded pt-6 pb-6"
          onSubmit={(e) => {
            e.preventDefault(); // This will prevent the default form submission
            if (props.mode === 'signup') {
              handleSignUp();
            } else {
              handleLogIn();
            }
          }}
        >
          <button
            className="hover:bg-gray-50 text-gray-500 font-semibold mb-2 py-2 px-4 w-full border border-gray-300 rounded shadow"
            type="button"
          >
            {props.mode === 'signup' ? ' Sign Up' : ' Log In'} with Google
          </button>
          <div className="text-gray-600 mt-2">
            {props.mode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
            <a
              href="#"
              className="text-blue-400"
              onClick={(e) => {
                e.preventDefault();
                props.onToggleMode();
              }}
            >
              {props.mode === 'signup' ? ' Log In' : ' Sign Up'}
            </a>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
