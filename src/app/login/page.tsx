import LoginForm from "@/components/login-form";
import Image from "next/image";

export default async function LoginPage({children}:any) {
    return (
        <div className="flex sm:items-center sm:justify-center h-screen w-screen">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 max-w-screen-lg mx-auto rounded-lg shadow-2xl p-20 gap-20 ring-1 ring-gray-200">
                <div className="mt-20 sm:mt-auto relative z-10">
                  <h1 className="text-lg font-bold text-center font-medium mb-10">Enter Login Credentials</h1>
                  <LoginForm/>
                </div>
                <div className="absolute top-0 sm:relative -z-0 opacity-10">
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