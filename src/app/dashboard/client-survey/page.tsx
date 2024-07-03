import { auth } from "@/auth";
import ClinicQr from "@/components/clinic-qrcode";
import CopyButton from "@/components/copy-text-button";
import { InputText } from 'primereact/inputtext';
import { ExtendedSession } from "../../../../typings";

export default async function Page() {
    const session = await auth() as unknown as ExtendedSession    
    let clinicId = session?.user_id
    let url = `${process.env.NEXTAUTH_URL}/survey/client?cid=${clinicId}`;
    console.log(session)
    return (
        <div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-lg *:py-6 *:px-6">
             <div className="col-span-3 row-span-1 flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium">Client Survey</h1>
             </div>
            <div className="col-span-3 row-span-5 flex flex-row flex-wrap gap-20 justify-center">
                <div className="flex flex-col items-center gap-5">
                    <p>Let your clients scan the QR code</p>
                    <ClinicQr text={url}/>
                </div>
                <div>
                    <p>Or share this link for them to visit</p>
                    <p className="text-sm text-neutral-400">* You can also include this link in your marketing emails.</p>
                    <div className="flex flex-row gap-2 mt-5">
                        <InputText value={url} className="text-xs p-2 flex-1" readOnly />
                        <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`}/>
                    </div>
                </div>
            </div>
        </div>
    );
}