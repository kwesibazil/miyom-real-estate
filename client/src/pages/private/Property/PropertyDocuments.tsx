import { useState, useEffect} from 'react';

import { useAppSelector } from '@hooks/useRedux.hook';

import { RiUploadCloudFill } from "react-icons/ri";

import { DownloadFile } from '@store/features/property/propertyStore.interface';
import { selectUser } from '@store/features/auth/AuthSlice.store';

// import { MdDelete } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { FaFile } from "react-icons/fa";
// import { HiClipboardDocument } from "react-icons/hi2";

import './SingleProperty.css'
import FormFeedback from '@components/forms/FormFeedback';


import NoResultImage from "@components/skelton/NoResult";

import { PiUploadSimpleBold } from "react-icons/pi";

import { useFileUpload } from '@hooks/useFileUpload';


interface TableProp{
  propertyId: string
  reportUrls: DownloadFile[]
  legalUrls: DownloadFile[]
}


const PropertyDocumentsTable = ({ reportUrls, legalUrls, propertyId }: TableProp) => {
  const user = useAppSelector(selectUser);
  const [documents, setDocuments] = useState<DownloadFile[]>([]);
  const { handleFileChange, status, onComplete } = useFileUpload({ propertyId });

  useEffect(() => {
    if (reportUrls || legalUrls) {
      setDocuments([...reportUrls, ...legalUrls]);
    }
  }, [reportUrls, legalUrls]);



  return (
    <div className="property-gallery mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="primary-heading mb-0">Documents</h1>
        {(status !== "idle" && status !== "pending") && (
          <FormFeedback showSuccess={false} status={status} onComplete={onComplete} />
        )}
        {
          documents.length !== 0 && user?.userRole === 'admin' && (
            <div className="upload-image-btn text-white position-relative">
              <RiUploadCloudFill className="camera-icon" />
              <input
                onChange={handleFileChange}
                multiple
                type="file"
                id="fileUpload"
                className="file-input"
                accept="application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              />
              <p className="mb-0 ms-2">Upload file</p>
            </div>
          )
        }
      </div>

      {
        documents.length === 0 ? (
          user?.userRole === 'admin' ? (
            <div className="upload-box">
              <div className="icon-container"><PiUploadSimpleBold className="fs-1" /></div>
              <div className="d-flex flex-column">
                <p className="fs-6">Upload PDF Files</p>
                <div className="upload-image-btn text-white position-relative my-1">
                  <RiUploadCloudFill className="camera-icon" />
                  <input
                    onChange={handleFileChange}
                    multiple
                    type="file"
                    className="file-input"
                    accept="application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  />
                  <p className="ms-2 text-white">Upload file</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="property-gallery-placeholder ">
              <div className="col property-gallery-card d-flex align-items-center">
                <div className='d-flex flex-column align-items-center w-50  '>
                  <div className='table-image-container h-75'>
                    <NoResultImage/>
                  </div>
                  <p className=" mb-3 mt-2 ">No Document available</p>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="document-table-container overflow-hidden">
            <header className="document-table-header py-3">
              <h5 className="col ps-3 text-start">File</h5>
              <h5 className="col-2 d-none d-sm-block col-lg-1">Size</h5>
              <h5 className="d-none d-lg-block col-md-2 col-lg-1">Type</h5>
              <h5 className="d-none d-md-block col-md-2">Uploaded by</h5>
              <h5 className="col-4 col-md-2 last-modified">Last modified</h5>
              <h5 className="col-3 col-md-2 fs-6 download text-center">Download</h5>
            </header>
            <div>
              {documents.slice(0, 5).map((document) => (
                <div key={document.secureUrl} className="table-row">
                  <div className="d-flex col">
                    <FaFile className="fs-2 ms-3 me-4" />
                    <p className="col text-start">{document.filename}</p>
                  </div>
                  <p className="col-2 col-lg-1 d-none d-sm-block">
                    {(document.sizeInBytes / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <p className="col-md-2 col-lg-1 d-none d-lg-block">{document.mime.split('/').pop()}</p>
                  <p className="col-md-2 d-none d-md-block">{document.uploadedBy}</p>
                  <p className="col col-4 col-md-2 last-modified">{new Date(document.uploadedAt).toLocaleDateString()}</p>
                  <div className="col-3 col-md-2 download text-center">
                    <a href={document.secureUrl} download target="_blank" rel="noopener noreferrer">
                      <IoMdDownload className="mx-3 fs-6" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    </div>
  );
};


export default PropertyDocumentsTable;



 {/* {user?.userRole === 'admin' && (
                      <MdDelete className="text-danger fs-6" role="button" />
                    )} */}