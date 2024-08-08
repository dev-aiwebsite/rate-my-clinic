'use client'
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";
import * as LR from '@uploadcare/blocks';
import { useEffect, useRef, useState } from 'react';

LR.registerBlocks(LR);

function InputFile({ defaultValue, name, required = false, isHidden, customElement,disabled }: { defaultValue: string, name: string, required?: boolean, isHidden?: boolean, customElement?: React.ReactNode, disabled?: boolean, }) {

  const [inputValue, setInputValue] = useState(defaultValue || "");
  const [fileName, setFileName] = useState("");
  const ctxProviderRef = useRef<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const handleUpload = async (e: any) => {
      try {
        const fileUrl = e.detail.allEntries[0].cdnUrl;
        const fileName = e.detail.allEntries[0].name;
        setFileName(fileName);
        setInputValue(fileUrl);
      } catch (error) {
        console.log(error);
      }
    };

    const currentRef = ctxProviderRef.current;
    currentRef?.addEventListener('common-upload-success', handleUpload);

    return () => {
      currentRef?.removeEventListener('common-upload-success', handleUpload);
    };
  }, []);

  return (
    <div className={`${disabled ? 'pointer-events-none' : ""} uploadProfile-wrapper flex flex-row gap-1 items-center`}>
      {customElement}
      <input className="invisible !w-[1px] !absolute" type="text" name={name} value={inputValue} onChange={handleInputChange} {...(required && { required: true })} />
      <lr-config
        ctx-name={`my-uploader-${name}`}
        pubkey="e7ce38ef727023b7bded"
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
        sourceList="local, url, camera"
      ></lr-config>

      <lr-file-uploader-regular
        ctx-name={`my-uploader-${name}`}
        class="my-config"
      >
      </lr-file-uploader-regular>

      <lr-upload-ctx-provider ref={ctxProviderRef} ctx-name={`my-uploader-${name}`} />
      <img src={inputValue} className={`${inputValue ? "" : "hidden"} h-6 w-6 ${isHidden}`} />
      <span>{fileName}</span>
    </div>
  );
}

export default InputFile;
