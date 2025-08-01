"use client"
import {GetProductsWithPrices } from "lib/server-actions";
import PricingCard from "components/pricingCard";
import Stripe from "stripe";
import { useEffect, useState } from "react";
import { useSessionContext } from "@/context/sessionContext";
import { useSearchParams } from "next/navigation";

interface TproductWithPrices extends Stripe.Product {
    prices: {[key:number]:any}
}

export const ProductCards = ({enabled = false,metadata}:{enabled?:boolean,metadata:{[key:string]:any}})=>{
    const [products,setProducts] = useState<TproductWithPrices[] | null>(null)
    const searchParams = useSearchParams()
    const checkoutSubsLevel = searchParams.get('csl')
    
    useEffect(()=>{
        GetProductsWithPrices()
        .then(p => {
            // show only free
            // const selectedProduct = p.find(a => a.metadata.subscription_level == '0')
            // if(selectedProduct){
            //     setProducts([selectedProduct])
            // } 

            const selectedProduct = p.find(a => a.metadata.subscription_level == checkoutSubsLevel)
            if(selectedProduct){
                setProducts([selectedProduct])
            } else {
                p.sort((a, b) => Number(a.metadata.subscription_level) - Number(b.metadata.subscription_level));
                setProducts(p)
            }
         
    
        })
    },[])

    return <>
    {!products && <><div className="flex items-center justify-center">
        <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
        >
            </div>
    </div></>}
            {products &&
                <div className="flex justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 mx-auto max-w-screen-lg">
                {products.map((product, index) => {
                    const allMeta = {...product.metadata, ...metadata}
                    return <PricingCard metadata={allMeta} product={product} durations={enabled ? "annually" : "monthly"} key={index}/>
                    })}
                </div>
            }
        </>


    
}