'use client'
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css"
import * as LR from '@uploadcare/blocks';
import { useEffect, useRef, useState } from 'react';
import { UpdateUser } from "lib/server-actions";

LR.registerBlocks(LR);
 

function ProfileUploadBtn({userSession}:any) {
  
  const ctxProviderRef = useRef<typeof LR.UploadCtxProvider.prototype & UploadCtxProvider>(null)
  useEffect(() => {
    let currentRef = ctxProviderRef.current
    const handleUpload = async (e:any) => {
        
        try {
            const profilePic = e.detail.allEntries[0].cdnUrl
            const user = await UpdateUser({"useremail": userSession?.user_email}, {"img": profilePic})
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
      <div className="uploadProfile-wrapper">
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
    </div>
  );
}

export default ProfileUploadBtn;