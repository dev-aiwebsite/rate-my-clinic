import LoginForm from "../../components/login-form";
import Image from "next/image";

export default async function LoginPage({children}:any) {
    return (
        <div className="flex sm:items-center sm:justify-center h-screen w-screen">
             <Image 
                        className="fixed h-full w-full -z-10 opacity-50 bg-blue-100"
                        src="/images/logos/rmc-login-optmz.png" 
                        width={1000}
                        height={1000}
                        alt="wrh logo"
                    />
            <div className="card p-14 z-10">
                <div className="mt-20 sm:mt-auto relative z-10">
                  <h1 className="text-lg font-bold text-center font-medium mb-10">Enter Login Credentials</h1>
                  <LoginForm/>
                </div>
            </div>

        </div>
    );
}