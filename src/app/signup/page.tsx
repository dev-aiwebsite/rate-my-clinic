import LoginForm from "@/components/login-form";
import SignupForm from "@/components/signup-form";
import Image from "next/image";

export default function SignupPage({children}:any) {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="grid grid-cols-2 max-w-screen-lg mx-auto rounded-lg shadow-2xl p-20 gap-20 ring-1 ring-gray-200">
                <div>
                  <h1 className="text-lg font-bold text-center font-medium mb-10">Enter User Details</h1>
                  <SignupForm/>
                </div>
                <div>
                    <Image 
                        className="h-full w-full"
                        src="/images/logos/signup-optmz.png" 
                        width={600}
                        height={600}
                        alt="rate my clinic signup image"
                    />
                </div>
            </div>

        </div>
    );
}