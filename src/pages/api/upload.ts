// var axios = require('axios');
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import { NextApiRequest, NextApiResponse } from "next";
import { cloudy } from "../../utils/cloudinary";
import { Storage } from "../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const storageRef = ref(Storage, `logo/logo_${req.query?.id}.png` || "file");

  const id = req.query.id as string;

  // 'file' comes from the Blob or File API

  // const metadata = {
  //   contentType: 'image/png',
  // };

  console.log(req.body.query);

  // const uploadTask = uploadBytesResumable(storageRef, file);
  // uploadTask.then(async (r) => {
  //   const logo = await getDownloadURL(uploadTask.snapshot.ref);
  //   console.log("logo", logo);

  cloudy.uploader.upload(
    req.body.file,
    {
      upload_preset: "ml_default",
      folder: req.query.folder as string,
      filename_override: id,
    },
    async (error: any, result: any) => {
      if (error) res.status(500).send({ message: "erreur d'upload" });
      else {
        await prisma?.etablissement.update({
          where: {
            id: id,
          },
          data: {
            logo: result.url,
          },
        });
       
      }
    }
  );
  res.status(200).send({ });
};
