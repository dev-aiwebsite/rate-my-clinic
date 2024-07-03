"use client"
import { useSessionContext } from '@/context/sessionContext';
import dynamic from 'next/dynamic';
import { useMediaQuery } from "react-responsive";

const NavbarDesktop = dynamic(() => import('./navbar-desktop'), {
  ssr: false,
});

const NavbarMobile = dynamic(() => import('./navbar-mobile'), {
  ssr: false,
});

const Navbar = () => {
  const {currentUser,setCurrentUser} = useSessionContext()
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return isMobile ? <NavbarMobile userData={currentUser} /> : <NavbarDesktop userData={currentUser} />;
};

export default Navbar;