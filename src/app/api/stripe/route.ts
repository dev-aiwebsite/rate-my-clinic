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

export async function POST(req:NextRequest, res: NextResponse){
    const payload = await req.text()
    const response =  JSON.parse(payload)
    const sig = req.headers.get('Stripe-Signature')

    if(sig){
        let event = stripe.webhooks.constructEvent(payload,sig as string,process.env.STRIPE_WEBHOOK_SECRET as string)
        console.log(event)
    }

    try {
    
       const {priceId} = response
       const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            ui_mode: 'embedded',
            line_items: [{
               price: priceId,
               quantity: 1
            }],
            custom_fields: [
                {
                  key: 'clinic_name',
                  label: {
                    type: 'custom',
                    custom: 'Clinic Name',
                  },
                  type: 'text',
                },

                {
                    key: 'clinic_type',
                    label: {
                        type: 'custom',
                        custom: 'Clinic Type',
                    },
                    
                    type: 'dropdown',
                    dropdown: {
                       options: [
                           {
                               label: 'General Practitioner (GP) Clinic',
                               value: 'GP',
                           },
                           {
                               label: 'Dental Clinic',
                               value: 'Dental',
                           },
                           {
                               label: 'Community Health Clinic',
                               value: 'Community',
                           },
                           {
                               label: 'Mental Health Clinic',
                               value: 'Mental',
                           },
                           {
                               label: 'Specialist Clinic',
                               value: 'Specialist',
                           },
                       ],  
                    },
                },
              ],
            // redirect_on_completion: "never",
            return_url: `${req.headers.get('origin')}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
       })

       return NextResponse.json({status: "success", id: session.id, client_secret: session.client_secret})
    } catch (error) {
        return NextResponse.json({status: "failed", error})
    }
   

}

// async function stripeListen(req:NextRequest){  
//     const payload = await req.text()
//     const response =  JSON.parse(payload)
//     const dateTime = new Date(response?.created * 1000).toLocaleDateString()
//     const timeString = new Date(response?.created * 1000).toLocaleDateString()

//     try {
//         let event = stripe.webhooks.constructEvent(payload,sig as string,process.env.STRIPE_WEBHOOK_SECRET as string)
//         return NextResponse.json({status: "success", event: event.type})
//     } catch (error) {
//         return NextResponse.json({status: "failed", error})
        
//        }
// }