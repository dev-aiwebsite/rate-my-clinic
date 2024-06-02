"use client"
import dynamic from 'next/dynamic';
import { useMediaQuery } from "react-responsive";

const SidebarDesktop = dynamic(() => import('./sidebar-desktop'), {
  ssr: false,
});

const SidebarMobile = dynamic(() => import('./sidebar-mobile'), {
  ssr: false,
});

const Sidebar = ({ userData }:{userData:any}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return isMobile ? <SidebarMobile userData={userData} /> : <SidebarDesktop userData={userData} />;
};

export default Sidebar;