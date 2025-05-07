import { useState, useCallback } from 'react';
import { UploadPropertyFileInput } from '@store/features/property/propertyStore.interface'; 
import { uploadPropertyFile } from '@store/features/property/PropertyThunk.store'; 

import { selectUser } from '@store/features/auth/AuthSlice.store';
import { useAppDispatch, useAppSelector } from './useRedux.hook';


export function useFileUpload({ propertyId }: { propertyId: string }) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const user = useAppSelector(selectUser)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');


  const handleFileChange = useCallback(async(event: React.ChangeEvent<HTMLInputElement>)=>{
    try {
      if (user?.userRole !== 'admin') return;

      const files = event.target.files;
      if (!files || files.length === 0) return;
      setStatus('pending');


      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];

      const validFiles = Array.from(files).filter(file => allowedMimeTypes.includes(file.type));


      if (validFiles.length === 0) {
        setStatus('failed');
        setError('Only documents files are supported.')
        return;
      } 

      const payload: UploadPropertyFileInput = {
        files: validFiles,
        uploadType: 'legal',
        propertyId: propertyId,
      };

      await dispatch(uploadPropertyFile(payload));
      setStatus('success');
    } catch (error:any) {
      setStatus('failed')
      setError('Upload Failed')
    }
  },[propertyId])




  const onComplete = useCallback(() => {
    if (status === "failed")
      setTimeout(() => alert(error), 500);

    setStatus("idle");
  }, [status, error]);




  return {handleFileChange, status, onComplete};
}
