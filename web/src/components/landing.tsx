import { useState } from 'react'
import AuthModal from '@/components/auth';
import Image from 'next/image';

const Landing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup"); 

  const handleSignUp = () => {
    setAuthMode("signup");
    setIsModalOpen(true);
  }
  const handleLogIn = () => {
    setAuthMode("login");
    setIsModalOpen(true);
  }

    return (
      <div className="flex flex-col mx-auto pt-20 md:pt-40 px-8 sm:px-10 h-full">
        <div className="flex-none mb-4 w-full justify-center">
          <Image src="/DragonAI.png" alt="DragonAI Logo" width={300} height={300} className="mt-8 mb-4"/>
        </div>
        <div className="flex justify-center my-10 text-lg">
          <button onClick={() => handleSignUp()} className='text-indigo-600 hover:text-indigo-400'>
            Sign Up
          </button>
          <span>&nbsp;|&nbsp;</span>
          <button onClick={() => handleLogIn()} className='text-indigo-600 hover:text-indigo-400'>
            Login
          </button>
        </div>
        {isModalOpen && 
        <AuthModal 
          onClose={() => setIsModalOpen(false)} 
          mode={authMode} 
          onToggleMode={() => setAuthMode(authMode === "signup"? "login" : "signup")}
          onAuthenticated={(isAuthenticated) => {
            setIsModalOpen(!isAuthenticated); // Close modal if authenticated
          }}
        />}
      </div>
    )
  };

export default Landing;