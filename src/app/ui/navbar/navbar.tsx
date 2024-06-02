"use client"
import dynamic from 'next/dynamic';
import { useMediaQuery } from "react-responsive";

const NavbarDesktop = dynamic(() => import('./navbar-desktop'), {
  ssr: false,
});

const NavbarMobile = dynamic(() => import('./navbar-mobile'), {
  ssr: false,
});

const Navbar = ({ userData }:{userData:any}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return isMobile ? <NavbarMobile userData={userData} /> : <NavbarDesktop userData={userData} />;
};

export default Navbar;