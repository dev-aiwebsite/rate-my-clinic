import { CSSProperties, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
const shapeStyle: CSSProperties = {
    shapeOutside: `inset(calc(100% - 100px) 0px 20px 50px)`
}

type Tparams = {
    className?:string;
    canClose?:boolean;
}
export default function HelperCard({className,canClose}:Tparams) {
    const [isHidden,setIsHidden] = useState(false);
    

    function handleClose(){
        setIsHidden(true)
    }
    return (
        <div className={`${className} ${isHidden ? 'hidden' : ''} targetParent md:max-w-[320px] bg-white ring-1 ring-gray-500 rounded-lg p-10 flex pb-0 overflow-hidden mb-px text-sm`}> 
        {canClose && <button className="absolute top-4 right-4 transition duration-150 ease-in-out hover:rotate-[10deg] hover:scale-125" type="button" onClick={handleClose}><span className="pi pi-times"></span></button>}
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