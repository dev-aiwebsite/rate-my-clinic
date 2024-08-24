
import React, { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';

export default function AppDialog({isVisible = false, header,children}:{isVisible?:boolean, header?:string,children?:React.ReactNode}) {
    const [visible, setLocalVisible] = useState<boolean>(isVisible);


    useEffect(() => {
        setLocalVisible(isVisible);
      }, [isVisible]);
    return (
        
            <Dialog header={header} visible={visible} onHide={() => {if (!visible) return; setLocalVisible(false); }}>
                <div className="min-w-96 max-w-[90vw]">
                    {children}
                </div>
            </Dialog>
        
    )
}
        