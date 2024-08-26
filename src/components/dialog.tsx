
import React, { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';

type Tposition = "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | undefined
type TsetIsVisible = ()=>void

type Tparams = {
    setIsVisible:TsetIsVisible,
    position?:Tposition,
    isVisible?:boolean,
    header?:string,
    children?:React.ReactNode
}

export default function AppDialog({position,isVisible, setIsVisible, header,children}:Tparams) {
 
    return (
        
            <Dialog position={position} header={header} visible={isVisible} onHide={setIsVisible}>
                <div className="w-96 max-w-[90vw]">
                    {children}
                </div>
            </Dialog>
        
    )
}
        