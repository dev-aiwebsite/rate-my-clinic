import Navbar from "@/ui/navbar/navbar"
import Sidebar from "@/ui/sidebar/sidebar"
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const layout = ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {

  const value = {
    ripple: true,
};

 return <PrimeReactProvider value={value}>
  <div className="h-screen flex flex-col">
      <Navbar/>
   <div className="flex-1 flex flex-row">
      <Sidebar/>
      {children}
   </div>

 </div>
 </PrimeReactProvider>
}

export default layout