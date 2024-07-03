import { auth } from "@/auth";
import Navbar from "@/ui/navbar/navbar"
import Sidebar from "@/ui/sidebar/sidebar"
import { ExtendedSession } from "../../../typings";
import SessionContextProvider from "@/context/sessionContext";
import { fetchData } from "@/lib/data";



const layout = async ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {

  const session = await auth() as unknown as ExtendedSession
  const Users = await fetchData()
  const currentUser = JSON.parse(JSON.stringify(Users.find(i => i._id == session.user_id)))
  
 return <SessionContextProvider current_user={currentUser}>
        <div className="h-screen flex flex-col">
            <Navbar/>
            <div className="flex-1 flex flex-row">
            <Sidebar/>
            {children}
        </div>
      </div>
 </SessionContextProvider>
}

export default layout