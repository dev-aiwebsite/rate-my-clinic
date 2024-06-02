"use client"
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'primeicons/primeicons.css';
import { Ripple } from 'primereact/ripple';

const CopyButton = ({buttonText,textToCopy, toolTip,showIcon = true,className }:{buttonText?:string,textToCopy:string,toolTip?:any,showIcon?:boolean,className?:string}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 1000);
        
    };

    return (
            <CopyToClipboard text={textToCopy} onCopy={handleCopy}>
                <Button
                    id="copy-btn"
                    icon={copied ? "pi pi-check" : "pi pi-copy"}
                    className={`${className} p-button-text text-sm p-ripple`}
                    data-pr-position="bottom"
                    // unstyled={true}
                >
                    <span className='pi-file-check hidden'></span>
                    {copied ? 'Copied!' : buttonText}

                    {toolTip &&
                        <Tooltip target="#copy-btn">
                            {toolTip}
                        </Tooltip>
                    }
                        <Ripple />
                </Button>
            </CopyToClipboard>
    );
};

export default CopyButton;
