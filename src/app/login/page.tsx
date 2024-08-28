import LoginForm from "../../components/login-form";
import Image from "next/image";

export default async function Page({searchParams}:{ searchParams:any}) {
    let isViaAdmin = searchParams.va || ""

    return (
        <div className="max-md:flex-col max-md:items-center flex sm:items-center sm:justify-center h-screen w-screen p-10">
              <Image 
                                        className="md:hidden w-48 mb-10"
                                        src="/images/logos/rmc-logo.png" 
                                        width={600}
                                        height={600}
                                        alt="rate my clinic signup image"
                                    />
          
            <div className="relative grid grid-cols-1 sm:grid-cols-2 max-w-screen-lg mx-auto rounded-lg shadow-2xl p-10 max-md:w-full md:p-20 gap-20 ring-1 ring-gray-200">
                <div className="sm:mt-auto relative z-10">
                  <h1 className="text-lg font-bold text-center font-medium mb-10">Enter Login Credentials</h1>
                  <LoginForm viaAdmin={isViaAdmin}/>
                </div>
                <div className="max-md:hidden absolute top-0 sm:relative -z-0 opacity-10 sm:opacity-100">
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