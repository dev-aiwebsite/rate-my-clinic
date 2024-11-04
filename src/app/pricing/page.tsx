"use client"
import Switcher from "../../components/switcher";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { ProductCards } from "components/product-cards";
import { useSessionContext } from "@/context/sessionContext";

export default function PricingPage({searchParams,children }:any) {
    const [enabled, setEnabled] = useState(false);
    const {currentUser} = useSessionContext()
    
    const handleSwitcherClick = () => {
        setEnabled(!enabled);
    };

    let metadata:any = {
        'app_name': 'rmc',
    }

    if(currentUser?._id){
        metadata['user_id'] = currentUser._id
        metadata['useremail'] = currentUser.useremail

    }



    return (
        <div className="flex items-center justify-center h-screen w-screen">
        <div className="w-full max-w-screen-lg h-[90vh] mx-auto rounded-lg shadow-2xl p-10 py-10 gap-20 ring-1 ring-gray-200 relative">
                <Link className="absolute top-5 left-5 rounded-lg bg-transparent hover:bg-gray-100 p-2"
                 href={"/login"}><IoIosArrowRoundBack size={24} /></Link>
            
            <div className="flex flex-col items-center h-full w-full overflow-auto px-10 pb-10">
                <h1 className="text-4xl font-medium my-4">Pricing plans for teams of all sizes</h1>
                <p className="font-[300] max-w-2xl text-center">Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.</p>
                <div className="py-16">
                    <Switcher enabled={enabled} setEnabled={handleSwitcherClick}/>
                </div>
                <div>
                    <ProductCards metadata={metadata}/>
                   
                </div>
            </div>
        </div>

    </div>
    );
}


