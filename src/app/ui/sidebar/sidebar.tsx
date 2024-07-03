"use client"
import { useSessionContext } from '@/context/sessionContext';
import dynamic from 'next/dynamic';
import { useMediaQuery } from "react-responsive";

const SidebarDesktop = dynamic(() => import('./sidebar-desktop'), {
  ssr: false,
});

const SidebarMobile = dynamic(() => import('./sidebar-mobile'), {
  ssr: false,
});

const Sidebar = () => {
  const {currentUser,setCurrentUser} = useSessionContext()
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return isMobile ? <SidebarMobile userData={currentUser} /> : <SidebarDesktop userData={currentUser} />;
};

export default Sidebar;