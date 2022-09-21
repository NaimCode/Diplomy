import { Uploader, Message, Loader, useToaster } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import React, { useEffect, useId, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AddIcon } from "../constants/icons";
import { setTimeout } from "timers";
import axios from "axios";
import { getDownloadURL, ref } from "firebase/storage";
import { Storage } from "../utils/firebase";
import { trpc } from "../utils/trpc";
import Image from "next/image";

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
  id: string;
  props?: object;
};
const Upload = ({ label, url, name, id, props }: UploadProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState(null);
  const {mutate,isLoading}=trpc.useMutation(['parametreRouter.update image'],{
    onError:(err)=>{},
    onSuccess:()=>{},
    onSettled:()=>setUploading(false)
  })
   
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
          mutate({file:value,id:id,isLogo:true})
        });
      }}
      onSuccess={(response, file) => {
        setUploading(false);
       
      }}
      onError={() => {
        setFileInfo(null);
        setUploading(false);
        toast.error("global.toast erreur");
      }}
    >
      <button
        style={{ width: 160, height: 160 }}
        className="flex flex-col justify-center items-center"
      >
        {uploading && <Loader backdrop center />}
        {fileInfo ? (
          <Image src={fileInfo} layout="fill"  className="object-cover w-full"/>
        ) : url ? (
          <Image src={url} layout="fill"  className="object-cover w-full" />
        ) : (
          <label>{label}</label>
        )}
      </button>
    </Uploader>
  );
};


export default Upload;
