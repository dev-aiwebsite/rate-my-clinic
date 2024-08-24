
import React, { useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export default function DialogConfirm({}) {
    const toast = useRef<Toast>(null);

    const accept = () => {
        toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }


    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog id="dlg_confirmation" visible={true} message="Are you sure you want to proceed?"
header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button icon="pi pi-check" label="Confirm" className="mr-2"></Button>
            </div>
        </>
    )
}
        