"use client"
import { retrieveCheckoutSession } from "@/api/stripe/actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import Stripe from "stripe";

type params = {
    sessionId:string
}

const MembershipDetails = ({sessionId}:params) => {
    const [cs,setCs] = useState<Stripe.Response<Stripe.Checkout.Session> | null>(null)

    useEffect(()=>{
        retrieveCheckoutSession(sessionId)
        .then((cs:Stripe.Response<Stripe.Checkout.Session>) => {
            setCs(cs)
            console.log(cs)
        })
    },[])

    return (
        <>
          <div className="flex items-center flex-col justify-between flex-1">
                <h3 className="text-center">Membership</h3>
                <p className="text-xl text-center capitalize">{cs?.metadata?.level || cs?.metadata?.name || ""}</p>
                <div className="flex flex-col items-center gap-2">
                    <Link href="/pricing" className="text-xs font-medium text-orange-400 underline">Upgrade</Link>
                    {cs?.subscription && <Link href="#" className="text-xs font-medium text-gray-400">Cancel subscription</Link>}
                </div>
            </div>
        </>
    );
}

export default MembershipDetails;