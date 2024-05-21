import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'primeicons/primeicons.css';
import { Ripple } from 'primereact/ripple';

const CopyButton = ({ text,isTooltip = false,className }:{text:any,isTooltip:boolean | null,className:string}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    let tooltip = ""
    if(isTooltip){
        tooltip = copied ? 'Text copied to clipboard' : 'Click to copy text'
    }

    return (<div className={`${className} p-ripple rounded p-1 hover:bg-white hover:bg-opacity-10`}>
            <CopyToClipboard text={text} onCopy={handleCopy}>
                <Button
                    id="copy-btn"
                    icon="pi pi-copy"
                    className={"p-button-text text-sm"}
                    data-pr-position="bottom"
                    unstyled={true}
                >
                    <Tooltip target="#copy-btn" unstyled={true}>
                        <span className='text-xs'>copy text</span>
                    </Tooltip>
                </Button>
            </CopyToClipboard>
            <Ripple />
        </div>
    );
};

export default CopyButton;
