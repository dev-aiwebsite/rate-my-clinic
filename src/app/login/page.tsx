import LoginForm from "@/components/login-form";
import { fetchData } from "@/lib/data";
import Image from "next/image";

export default async function LoginPage({children}:any) {
        const users = await fetchData()
        console.log(users)
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="grid grid-cols-2 max-w-screen-lg mx-auto rounded-lg shadow-2xl p-20 gap-20 ring-1 ring-gray-200">
                <div>
                  <h1 className="text-lg font-bold text-center font-medium mb-10">Enter Login Credentials</h1>
                  <LoginForm/>
                </div>
                <div>
                    <Image 
                        className="h-full w-full"
                        src="/images/logos/rmc-login-optmz.png" 
                        width={600}
                        height={600}
                        alt="wrh logo"
                    />
                </div>
            </div>

        </div>
    );
}