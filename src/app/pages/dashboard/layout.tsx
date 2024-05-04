import Navbar from "@/components/navbar/navbar"
import Sidebar from "@/components/sidebar/sidebar"



const layout = ({children}) => {
 return <div className="h-screen flex flex-col">
      <Navbar/>
   <div className="flex-1 flex flex-row">
      <Sidebar/>
      {children}
   </div>

 </div>
}

export default layout