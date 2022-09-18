import { Uploader, Message, Loader, useToaster } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import React, { useId } from "react";
import { toast } from "react-toastify";
import { AddIcon } from "../constants/icons";
import { setTimeout } from "timers";

function previewFile(file: any, callback: any) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

type UploadProps = {
  label?: string;
  url?: string;
  name?:string
  
};
const Upload = ({ label, url,name }: UploadProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState(null);
  const id = useId();
  return (
    <Uploader
      fileListVisible={false}
      listType="picture"
      action={`/api/upload?name=${name}.png`}
      multiple={false}

      // shouldQueueUpdate={() => {
      //   alert('The file is checked and allowed to be added to the queue');
      //   return true;
      // }}
    
      onUpload={(file) => {
        setUploading(true);
        
        previewFile(file.blobFile,async (value: any) => {
          console.log('file', file.blobFile)
          setFileInfo(value);
        });
      }}
      onSuccess={(response, file) => {
        setUploading(false);
        toast.success("global.toast succes");
        console.log(file);
      }}
      onError={() => {
        setFileInfo(null);
        setUploading(false);
        toast.error("global.toast erreur");
      }}
    >
      <button
        style={{ width: 150, height: 150 }}
        className="flex flex-col justify-center items-center"
      >
        {uploading && <Loader backdrop center />}
        {fileInfo ? (
          <img src={fileInfo} width="100%" height="100%" />
        ) : url ? (
          <img src={url} width="100%" height="100%" />
        ) : (
          <label>{label}</label>
        )}
      </button>
    </Uploader>
  );
};

export default Upload;
