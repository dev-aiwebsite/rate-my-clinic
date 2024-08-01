import ForgotPasswordForm from "../../components/forgot-password-form";
import LoginForm from "../../components/login-form";
import { fetchData } from "../../lib/data";
import Image from "next/image";

export default async function LoginPage({children, search, searchParams}:any) {
    let userEmail = searchParams.ue
    let resetToken = searchParams.t
    let isPasswordResetValid = false
    let FormTitle = 'Password Reset Link'

    if(userEmail && resetToken){
        let users = await fetchData()
        let userDetails = users.find(i => i.useremail == userEmail)
        let validToken = userDetails?.passwordResetToken == resetToken
        isPasswordResetValid = validToken
        if(validToken){
            FormTitle = "Reset Password"
        }
    }

    return (
        <div className="flex sm:items-center sm:justify-center h-screen w-screen">
            <div className="relative grid grid-cols-1 sm:grid-cols-2 max-w-screen-lg mx-auto rounded-lg shadow-2xl p-20 gap-20 ring-1 ring-gray-200">
                <div className="flex flex-col h-full justify-center mt-20 relative sm:mt-auto z-10">
                  <h1 className="text-lg font-bold text-center font-medium mb-10">{FormTitle}</h1>
                  <ForgotPasswordForm isPasswordResetValid={isPasswordResetValid} userEmail={userEmail}/>
                </div>
                <div className="absolute top-0 sm:relative -z-0 opacity-10 sm:opacity-100">
                    <Image 
                        className="h-full w-full"
                        src="/images/logos/signup-optmz.png" 
                        width={600}
                        height={600}
                        alt="wrh logo"
                    />
                </div>
            </div>

        </div>
    );
}