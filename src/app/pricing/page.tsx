"use client"
import PricingCard from "@/components/pricingCard";
import Switcher from "@/components/switcher";
import { products } from "@/stripe_products";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function PricingPage({ children }: any) {
    const [enabled, setEnabled] = useState(false);

    const handleSwitcherClick = () => {
        setEnabled(!enabled);
    };
    return (

        <div className="flex items-center justify-center h-screen w-screen">
        <div className="max-w-screen-lg h-[90vh] mx-auto rounded-lg shadow-2xl p-10 py-10 gap-20 ring-1 ring-gray-200 relative">
                <Link className="absolute top-5 left-5 rounded-lg bg-transparent hover:bg-gray-100 p-2"
                 href={"/login"}><IoIosArrowRoundBack size={24} /></Link>
            
        <div className="flex flex-col items-center h-full w-full overflow-auto px-10 pb-10">
            <h1 className="text-4xl font-medium my-4">Pricing plans for teams of all sizes</h1>
            <p className="font-[300] max-w-2xl text-center">Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.</p>
            <div className="py-16">
                <Switcher enabled={enabled} setEnabled={handleSwitcherClick}/>
            </div>
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto max-w-screen-lg">
                   {Object.keys(products).map((key, index) => {
                     return <PricingCard product={products[key]} durations={enabled ? "annually" : "monthly"} key={index}/>
                    })}
                </div>
            </div>
        </div>
        </div>

    </div>
    );
}