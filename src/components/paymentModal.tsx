import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState, useCallback } from 'react'
import Stripe from 'stripe';
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { IoIosArrowRoundBack } from 'react-icons/io';


export default function PaymentModalButton({priceId,meta,mode}:{priceId:string, meta?:{[key:string]:any},mode:Stripe.Checkout.SessionCreateParams.Mode}) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
  let [isOpen, setIsOpen] = useState(false)
  let [isComplete, setIsComplete] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({mode, priceId: priceId, action:'createSession', metadata: meta }),
    });

    const data = await res.json();
  

    return data.client_secret;
  }, []);


  const options = {fetchClientSecret};
  

  function handleComplete(){
    // setIsComplete(true)
    alert('payment successfull')
    // fetch(`/api/stripe?session={}`)
  };
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
        <button
          type="button"
          onClick={openModal}
          className="btn-secondary"
        >
          Subscribe
        </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-[90vw] max-h-[90vh] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                   <button className='bg-none' onClick={closeModal}>
                    <IoIosArrowRoundBack size={24} />
                    </button>
                  </DialogTitle>
                  <div id="checkout" className='w-full max-h-[80vh] overflow-auto'>
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
                  </div>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}