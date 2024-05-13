import Navbar from "@/ui/navbar/navbar"
import Sidebar from "@/ui/sidebar/sidebar"



const layout = ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {
 return <div className="h-screen flex flex-col">
      <Navbar/>
   <div className="flex-1 flex flex-row">
      <Sidebar/>
      {children}
   </div>

 </div>
}

export default layout