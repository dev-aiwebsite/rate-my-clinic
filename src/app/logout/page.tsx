"use client"
import { handleLogout } from "lib/server-actions";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

const Page = () => {
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const logout = async () => {
      await handleLogout(); // Call the logout function
      router.push('/login'); // Redirect to login page after logout
    };

    logout(); // Execute the logout function
  }, [router]); // Add router as a dependency

  return (
    <div>
      Logging out...
    </div>
  );
};

export default Page;
