import { FaCheck } from "react-icons/fa6";
import PaymentModalButton from "./paymentModal";
import Stripe from "stripe";
import { Product } from "lib/products";
import Link from "next/link";
import { useSessionContext } from "@/context/sessionContext";
import { usePathname } from 'next/navigation'
interface TproductWithPrices extends Stripe.Product {
    prices: {[key:number]:any}
}

const PricingCard = ({product, durations,metadata}:{product:TproductWithPrices | Product, durations:"monthly" | "annually",metadata?:{[key:string]:any}}) => {
    
    let mode:Stripe.Checkout.SessionCreateParams.Mode = product?.prices[0].type == 'one_time' ? 'payment' : 'subscription'
    let price = Math.round(product.prices[0].unit_amount / 100)
    let price_name = product.name
    let isMonthly = Number(product?.metadata.subscription_level) > 1
    const {currentUser} = useSessionContext()
    const pathname = usePathname()

    
    let isSignup = false
    
    if(pathname == '/signup'){
        isSignup = true
    }

    let isUpgrade = false 

    // Post-assessment options will only be displayed if the user has an initial assessment plan.
    if(currentUser && Number(currentUser.subscription_level) > 0){
        isUpgrade = true
    }

    if(isUpgrade && Number(product?.metadata.subscription_level) < 2){
        return (<>
        </>)

    } else if(!isUpgrade && Number(product?.metadata.subscription_level) > 1){
        return (<>
        </>)
    }

    if(Number(product?.metadata.subscription_level) > 1){
        price_name = product.metadata.level || price_name
    }

    return (
        <div className="col-span-2 hover:ring-10 hover:ring-appblue-350 flex flex-col gap-6 rounded-3xl ring-1 ring-gray-300 p-6 text-sm font-[300]">
            <div>
                <span className="font-medium text-lg capitalize">{price_name}</span>
            </div>
            <div>
                {price != 0 && <span className="text-4xl font-medium">${price}</span>}
                {isMonthly && <span className="font-medium">/month</span>}
            </div>
            <p className="text-neutral-600">{product.description}</p>
            <ul className="flex flex-col gap-2 text-neutral-600 font-medium">
                {product.marketing_features.map((i,index)=> 
                    <li key={index} className="flex items-center gap-2 font-[300]">
                        <span className="text-blue-500"><FaCheck /></span>
                        <span>{i.name}</span>
                    </li>
                )

                }
            </ul>
            <div className="mt-auto w-full *:w-full">
                {currentUser || isSignup ? (<PaymentModalButton priceId={product.prices[0].id} meta={metadata} mode={mode}/>) :
                
                    (<Link className="block text-center w-full btn-secondary" href="/signup">Subscribe</Link>)
                }
            </div>
        </div>
    );
}

export default PricingCard;
// how to use
{/* <PricingCard product={products[key]} durations={enabled ? "annually" : "monthly"} key={index}/>  */}