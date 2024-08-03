import Image from "next/image";

export default function HowItWorksPage({ additionalClass }:{additionalClass?:string}) {
    return (<div className={`${additionalClass} card mx-auto max-w-screen-lg mt-20 p-5 md:p-20`}>
                <div className="text-4xl font-medium text-center mb-20">How it works</div>
                <ul className="font-[300] space-y-20">
                    <ol className="flex flex-row items-center gap-10">
                        <div className="flex items-center justify-center text-5xl font-bold text-white bg-orange-400 rounded-full leading-[0] p-10 aspect-square box-border">1</div>
                        <div className="flex flex-row gap-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium">Take the owner survey</h3>
                                <p>Your journey starts by taking the owner survey. On the left option panel, click on the Owner Survey and answer all the questions as accurate as you can. Once submitted your response is recorded in our database.</p>
                            </div>
                            <Image className="rounded-xl shadow-xl w-80 h-fit object-contain"
                                src='/images/owner_survey.webp'
                                width='600'
                                height='600'
                                alt=''
                            />
                        </div>
                    </ol>
                    <ol className="flex flex-row items-center gap-10">
                    <div className="flex items-center justify-center text-5xl font-bold text-white bg-orange-400 rounded-full leading-[0] p-10 aspect-square box-border">2</div>
                        <div className="flex flex-row gap-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium">Invite your team to answer the survey</h3>
                                <p>Next, select Team Survey from the option panel, have your team scan the QR code or copy the link and distribute it to your preferred communication channel (email, messenger, etc)</p>
                            </div>
                            <Image className="rounded-xl shadow-xl w-80 h-fit object-contain"
                                src='/images/share-tips.webp'
                                width='600'
                                height='600'
                                alt=''
                            />
                        </div>
                    </ol>
                    <ol className="flex flex-row items-center gap-10">
                    <div className="flex items-center justify-center text-5xl font-bold text-white bg-orange-400 rounded-full leading-[0] p-10 aspect-square box-border">3</div>
                        <div className="flex flex-row gap-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium">Invite your clients to answer the survey </h3>
                                <p>Finally, select Client Survey from the option panel: Copy the Client Survey link. Create an email campaign to using your marketing software (Mailchimp, ActiveCampaign, etc) Add the link to the CTA/Button in your email. Send the email to all clients that visited your clinic in the last 12 months.</p>
                            </div>
                            <Image className="rounded-xl shadow-xl w-80 h-fit object-contain"
                                src='/images/share-tips.webp'
                                width='600'
                                height='600'
                                alt=''
                            />
                        </div>
                    </ol>
                    <ol className="flex flex-row items-center gap-10">
                    <div className="flex items-center justify-center text-5xl font-bold text-white bg-orange-400 rounded-full leading-[0] p-10 aspect-square box-border">?</div>
                        <div className="flex flex-row gap-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium">What happens next?</h3>
                                <p>Team and Client survey responses will be recorded and displayed in your dashboard. Our system will then compare the values on your dashboard against the National Average. Guided by the dials, you will see if your clinic is below, in-line, or above the industry average.</p>
                                <p>{`After 10 days, we’ll generate the final clinic rating with recommendations and send it to your email address.`}</p>
                            </div>
                        </div>
                    </ol>
                </ul>
        </div>
    );
}