import { FaCheck } from "react-icons/fa6";
import PaymentModalButton from "./paymentModal";
import { Product } from "@/stripe_products";

  

const pricingCard = ({product, durations}:{product:Product, durations:"monthly" | "annually"}) => {
    return (
        <div className=" flex flex-col gap-6 rounded-3xl ring-1 ring-gray-300 p-6 text-sm font-[300]">
            <div>
                <span className="font-medium text-lg">{product.name}</span>
            </div>
            <p>{product[durations].description}</p>
            <div>
                <span className="text-4xl font-medium">{product[durations].price}</span><span className="font-medium">/month</span>
            </div>
            <PaymentModalButton priceId={product[durations].id} />
            <ul className="flex flex-col gap-2">
                {product[durations].included.map((i,index)=> 
                    <li key={index} className="flex items-center gap-2 font-[300]">
                        <span className="text-blue-500"><FaCheck /></span>
                        <span>{i}</span>
                    </li>
                )

                }
            </ul>
        </div>
    );
}

export default pricingCard;
// how to use
{/* <PricingCard product={products[key]} durations={enabled ? "annually" : "monthly"} key={index}/>  */}