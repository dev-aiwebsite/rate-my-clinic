import { auth } from "@/auth";
import Navbar from "@/ui/navbar/navbar"
import Sidebar from "@/ui/sidebar/sidebar"
import { ExtendedAdapterSession } from "../../../typings";



const layout = async ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {

  const session = await auth() as unknown as ExtendedAdapterSession
 return <div className="h-screen flex flex-col">
      <Navbar userData={session}/>
   <div className="flex-1 flex flex-row">
      <Sidebar userData={session}/>
      {children}
   </div>

 </div>
}

export default layout