"use server"
import { NextResponse, NextRequest} from "next/server"
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET!)
export async function GET(req:NextRequest){
    const { searchParams } = new URL(req.url)
    const session_id = searchParams.get('session')
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    if (session) {
        return NextResponse.json(session);
      } else {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
}

const domain = process.env.NEXT_PUBLIC_DOMAIN

export async function POST(req:NextRequest, res: NextResponse){

    const payload = await req.text()
    const requestData =  JSON.parse(payload)
    const sig = req.headers.get('Stripe-Signature')

    if(sig){
        let event = stripe.webhooks.constructEvent(payload,sig as string,process.env.STRIPE_WEBHOOK_SECRET as string)
        console.log(event)
    }

    try {
     
        const session = requestData.action == 'createPaymentIntent' ? await createPaymentIntent(requestData.amount) : await createStripeCheckoutSession(requestData)
        return NextResponse.json({status: "success", id: session.id, client_secret: session.client_secret})
  
    } catch (error) {
        return NextResponse.json({status: "failed", error})
    }
   

}


const createStripeCheckoutSession = async (request: { mode:Stripe.Checkout.SessionCreateParams.Mode, priceId: any, metadata?: {[key:string]:any} }) => {
    const { priceId} = request
    let mode = request.mode || 'subscription'
    let meta = request.metadata || {}
    meta['app_name'] = 'rmc'
    meta['product_id'] = priceId

    
    return await stripe.checkout.sessions.create({
        mode,
        ui_mode: 'embedded',
        line_items: [{
           price: priceId,
           quantity: 1
        }],
        metadata: meta,
        customer_email: meta.useremail || "",
        // redirect_on_completion: "never",
        return_url: `${domain}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
   })
}

const createPaymentIntent = async (amount:number) => {
    return await stripe.paymentIntents.create({
        amount: amount,
        currency: "AUD",
        automatic_payment_methods: { enabled: true },
    });
}