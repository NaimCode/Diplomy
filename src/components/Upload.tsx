/* eslint-disable @typescript-eslint/no-explicit-any */
import { Uploader, Loader } from "rsuite";
import React, { SetStateAction } from "react";
import { toast } from "react-toastify";


import { trpc } from "../utils/trpc";
import Image from "next/image";
import { useTranslation } from "next-i18next";

function previewFile(file:any, callback: (s:unknown)=>void) {
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
  table:'etablissement'|'utilisateur',
  folder?:string
};
const Upload = ({ label, url,  id, props,table,folder }: UploadProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [fileInfo, setFileInfo] = React.useState(null);
  const {t}=useTranslation()
  const {mutate}=trpc.useMutation(['parametreRouter.update image'],{
    onError:()=> {
      toast.success(t("global.toast erreur"))
    },
    onSuccess:()=>{
      toast.success(t("global.toast succes"))
    },
    // onSettled:()=>setUploading(false)
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

        previewFile(file.blobFile, async (value) => {
         
          mutate({file:value as string,id:id,table,folder:folder||""})
      
          setFileInfo(value as SetStateAction<null>);
        
      
        });
      }}
      onSuccess={() => {
        setUploading(false)
       
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
          <Image src={fileInfo} alt="image" layout="fill"  className="object-cover w-full"/>
        ) : url ? (
          <Image src={url} layout="fill" alt="image"  className="object-cover w-full" />
        ) : (
          <label>{label}</label>
        )}
      </button>
    </Uploader>
  );
};


export default Upload;
