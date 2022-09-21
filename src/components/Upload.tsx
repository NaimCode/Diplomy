import { Uploader, Message, Loader, useToaster } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import React, { useEffect, useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AddIcon } from "../constants/icons";
import { setTimeout } from "timers";
import axios from "axios";
import { getDownloadURL, ref } from "firebase/storage";
import { Storage } from "../utils/firebase";

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
  name?: string;
  id?: string;
  props?: object;
};
const Upload = ({ label, url, name, id, props }: UploadProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState(null);

  return (
    <Uploader
      fileListVisible={false}
      listType="picture"
      action={""}
      multiple={false}
      {...props}
      // shouldQueueUpdate={() => {
      //   alert('The file is checked and allowed to be added to the queue');
      //   return true;
      // }}

      onUpload={(file) => {
        setUploading(true);

        previewFile(file.blobFile, async (value: any) => {
          console.log(value);
          
          setFileInfo(value);
          await axios.post('/api/upload?folder=logo&id='+id,{file:value})
        });
     
       
        
      }}
      onSuccess={(response, file) => {
        setUploading(false);
        toast.success("global.toast succes");
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
          <MyImage url={fileInfo} props={{ width: "100%", height: "100%" }} />
        ) : url ? (
          <MyImage url={url} props={{ width: "100%", height: "100%" }} />
        ) : (
          <label>{label}</label>
        )}
      </button>
    </Uploader>
  );
};

const MyImage = ({ url, props }: { url: string; props?: object }) => {
  const [imgUrl, setimgUrl] = useState<string | undefined>();
 
  return <img src={url} {...props} />;
};
export default Upload;

