import { CSSProperties, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
const shapeStyle: CSSProperties = {
    shapeOutside: `inset(calc(100% - 100px) 0px 20px 50px)`
}

type Tparams = {
    className?:string;
    canClose?:boolean;
    onClose?:()=>void;
    isVisible?:boolean;
}
export default function HelperCard({className,canClose,onClose,isVisible = true}:Tparams) {
    const [isThisVisible,setIsThisVisible] = useState(isVisible);
    

    function handleClose(){
        setIsThisVisible(false)
        if(onClose){
            onClose()
        }
    }
    return (
        <div className={`${className} ${isThisVisible ? '' : 'hidden'} h-full targetParent bg-white ring-1 ring-gray-500 p-10 flex pb-0 overflow-hidden mb-px text-sm`}> 
        {canClose && <button className="absolute top-4 right-4 transition duration-150 ease-in-out hover:rotate-[10deg] hover:scale-125" type="button" onClick={handleClose}><span className="pi pi-times"></span></button>}
        <div>
            <div className="desktop-shape inline-flex items-end float-right h-full -mr-10 -mb-10" style={shapeStyle}>
                <Image
                    className="w-[150px] aspect-square w-auto h-auto" 
                    src="/images/logos/helper_avatar.png"
                    alt="recommendation avatar"
                    width={150}
                    height={150}
                />
            </div>
            <div className="inline">
                <span>Need expert advice? Book a free consultation with Paul Hedges</span>
                <br></br>
                <br></br>
                <a href="https://outlook.office.com/bookwithme/user/0841ad432ac1402f80962c82e69c1da6@ratemyclinic.com.au/meetingtype/t62Ix816wEOeGrY2V3gTEg2?anonymous&ep=mcard" target="_blank" className="inline-block btn-primary bg-orange-400 hover:bg-orange-500 mb-10">Book now</a>

            </div>
        </div>
    </div>
    );
}