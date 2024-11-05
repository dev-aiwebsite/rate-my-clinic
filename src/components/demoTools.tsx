"use client"
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useSessionContext } from '@/context/sessionContext';

export default function DemoTools() {
    const [visible, setVisible] = useState<boolean>(false);
    const {currentUser, setCurrentUser} = useSessionContext()

    return (
        <div className="shadow-lg absolute top-0 left-0 flex justify-content-center z-10">
            <Sidebar visible={visible} onHide={() => setVisible(false)}>
              <div>
                <button className='btn ring-1 ring-gray-200 shadow bg-appblue-300/90 hover:bg-appblue-300 text-white'>Add Client Survey Data</button>
              </div>
            </Sidebar>
            <Button onClick={() => setVisible(true)}>
                <span className='pi pi-cog pi-spin mr-1'></span>
                <span className='text-xs'>Demo settings</span>
            </Button>
        </div>
    )
}
        