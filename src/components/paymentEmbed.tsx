import {useState, useCallback } from 'react'
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

export default function PaymentEmbed({priceId}:{priceId:string}) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  let [isComplete, setIsComplete] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId: priceId }),
    });

    const data = await res.json();
    return data.client_secret;
  }, []);

  const options = {fetchClientSecret};

  function handleComplete(){
    setIsComplete(true)
  };

  return (
    <>
      
      <div>
        {!isComplete &&
            <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              ...options,
            onComplete: handleComplete}}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        }
        {isComplete && <div>Payment Successful</div>}
      </div>  
    </>
  )
}