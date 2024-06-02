'use client'
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css"
import * as LR from '@uploadcare/blocks';
import { useEffect, useRef, useState } from 'react';

LR.registerBlocks(LR);
 

function InputFile({name,required = false}:{name:string,required?:boolean}) {
  
  const [inputValue, setInputValue] = useState("")
  const [fileName, setFileName] = useState("")
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const ctxProviderRef = useRef<typeof LR.UploadCtxProvider.prototype & UploadCtxProvider>(null)
  useEffect(() => {
    let currentRef = ctxProviderRef.current
    const handleUpload = async (e:any) => {
        
        try {
            const fileUrl = e.detail.allEntries[0].cdnUrl
            const fileName = e.detail.allEntries[0].name
            setFileName(fileName)
            setInputValue(fileUrl)
            console.log(fileUrl, 'from InputFile')
            console.log(e)
        } catch (error) {
            console.log(error)
        }
    }
    currentRef?.addEventListener('common-upload-success', handleUpload)

    return () => {
      currentRef?.removeEventListener('common-upload-success', handleUpload)
    }

  })
  
  return (
      <div className="uploadProfile-wrapper flex flex-row gap-1 items-center">
        <input className="invisible !w-[1px] !absolute" type="text" name={name} value={inputValue} onChange={handleInputChange} {...(required && { required: true })} />
      <lr-config
          ctx-name="my-uploader"
          pubkey="e7ce38ef727023b7bded"
          maxLocalFileSizeBytes={10000000}
          multiple={false}
          imgOnly={true}
          sourceList="local, url, camera"
      ></lr-config>
      

      <lr-file-uploader-regular
          ctx-name="my-uploader"
          class="my-config"
      >
      </lr-file-uploader-regular>
        
    <lr-upload-ctx-provider ref={ctxProviderRef} ctx-name="my-uploader" />
    <img src={inputValue} className={`${inputValue ? "" : "hidden"} h-6 w-6`} />
    <span>{fileName}</span>

    </div>
  );
}

export default InputFile;