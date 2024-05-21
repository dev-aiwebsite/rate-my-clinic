import { CSSProperties } from "react";
import Image from "next/image";
const shapeStyle: CSSProperties = {
    shapeOutside: `inset(calc(100% - 100px) 0px 20px 50px)`
}

export default function HelperCard({className}:any) {
    return (
        <div className={`${className} max-w-[320px] bg-white ring-1 ring-gray-500 rounded-lg p-10 flex pb-0 overflow-hidden mb-px text-sm`}> 
        <div>
            <div className="inline-flex items-end float-right h-full -mr-10 -mb-10" style={shapeStyle}>
                <Image
                    className="w-[150px] aspect-square" 
                    src="/images/logos/helper_avatar.png"
                    alt="recommendation avatar"
                    width={150}
                    height={150}
                />
            </div>
            <div className="inline">
                <span>Need expert advise? Book a free consultation with Paul Hedges</span>
                <br></br>
                <br></br>
                <button className="btn-primary bg-orange-400 hover:bg-orange-500 mb-10">Book now</button>

            </div>
        </div>
    </div>
    );
}