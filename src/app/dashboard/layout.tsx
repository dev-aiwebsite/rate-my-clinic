import Navbar from "@/ui/navbar/navbar"
import Sidebar from "@/ui/sidebar/sidebar"
import { PrimeReactProvider } from "primereact/api";
import { auth } from "@/auth"
import { ExtendedAdapterSession } from "../../../typings";
import Image from "next/image";
import { fetchData } from "@/lib/data";
import UsersContextProvider from "@/context/usersContext";

const layout = async ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {



const session = await auth() as unknown as ExtendedAdapterSession
const Users = await fetchData()
const users = Users.map((user) => JSON.stringify(user.toObject()));

const value = {
    ripple: true,
};

 return <>
    <PrimeReactProvider value={value}>
      
        <div className="h-screen flex flex-col max-md:bg-[#f7f7f7]">
            <Navbar userData={session}/>
            <Image
                className="md:hidden h-42 w-auto m-auto p-5 md:hidden !bg-transparent !shadow-none"
                src="/images/logos/wrh-logo.png"
                width={600}
                height={600}
                alt="Wrh logo"  
            />
            <div className="flex-1 flex flex-row max-md:!pb-20 max-md:-mt-10">
                <Sidebar userData={session}/>
                <UsersContextProvider users={users}>{children}</UsersContextProvider>
            </div>
        </div>

    </PrimeReactProvider>
 </>
}

export default layout