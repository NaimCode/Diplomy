// var axios = require('axios');
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { NextApiRequest, NextApiResponse } from "next";
import { Storage } from "../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const storageRef = ref(Storage, (req.query?.name as string) || "file");
  console.log(req.query);

  // 'file' comes from the Blob or File API
  await uploadBytes(storageRef, Buffer.from(req.body)).then(
    async (snapshot) => {
      console.log("Uploaded a blob or file!", storageRef);
      
    }
  );
  res.status(400).json({ name: "John Doe" });
};

// var accountId = '0048fdb4150ba0e0000000001';
// var applicationKey = 'K004s+f7GwRbvNGAVOisav9jwFSY/G8';
// var credentials;
// var encodedBase64 = new Buffer.from(accountId + ':' + applicationKey).toString('base64');

// //
// var crypto = require('crypto');
// var path = require('path');
// var fs = require('fs');

// var bucketId = '18afcd2b14e145c08b3a001e';
// // var filePath = '/temp/myFile.txt';

// export default async(req, res) => {
// await axios.post(
//     'https://api.backblazeb2.com/b2api/v1/b2_authorize_account',
//     {},
//     {
//         headers: { Authorization: 'Basic ' + encodedBase64 }
//     })
//     .then(function (response) {
//         var data = response.data
//         credentials = {
//             accountId: accountId,
//             applicationKey: applicationKey,
//             apiUrl: data.apiUrl,
//             authorizationToken: data.authorizationToken,
//             downloadUrl: data.downloadUrl,
//             recommendedPartSize: data.recommendedPartSize
//         }
//         axios.post(
//             credentials.apiUrl + '/b2api/v1/b2_get_upload_url',
//             {
//                 bucketId: bucketId
//             },
//             { headers: { Authorization: credentials.authorizationToken } })
//             .then(function (response) {
//                 var uploadUrl = response.data.uploadUrl;
//                 var uploadAuthorizationToken = response.data.authorizationToken;
//                 var source = fs.readFile(req.body, function(err, buffer){})
//                 var fileName = path.basename(filePath)

//                 var sha1 = crypto.createHash('sha1').update(source).digest("hex");

//                 axios.post(
//                     uploadUrl,
//                     source,
//                     {
//                         headers: {
//                             Authorization: uploadAuthorizationToken,
//                             "X-Bz-File-Name": fileName,
//                             "Content-Type": "b2/x-auto",
//                             "Content-Length": fileSize,
//                             "X-Bz-Content-Sha1": sha1,
//                             "X-Bz-Info-Author": "unknown"
//                         }
//                     }
//                 ).then(function (response) {
//                     console.log("***");
//                     console.log("uploaded",response); // successful response
//                 }).catch(function (err) {
//                     console.log(err); // an error occurred
//                 });
//             })
//             .catch(function (err) {
//                 console.log(err); // an error occurred
//             });
//     })
//     .catch(function (err) {
//         console.log(err);  // an error occurred
//     });
//     res.status(400).json({ name: 'John Doe' })
// }
// const B2 =require('backblaze-b2')
// const fs =require('fs')
// const b2 = new B2({
//     applicationKeyId: '0048fdb4150ba0e0000000001',
//     applicationKey: 'K004s+f7GwRbvNGAVOisav9jwFSY/G8',
// });

// export default async(req:NextApiRequest, res:NextApiResponse) => {
//    await b2.authorize()
// .then(r =>
//     b2.uploadAny({
//         bucketId: '18afcd2b14e145c08b3a001e',
//         fileName: 'test_ds.png',
//         partSize: r.data.recommendedPartSize,
//         data:  Buffer.from(req.body, 'base64')
//         ,
//     }).then((data)=>{
//         console.log('data',data)
//     })
// )
// .then(() => { console.log('Upload complete'); }, console.log);
// // console.log('upload', req.body)
//   res.status(400).json({ name: 'John Doe' })
// }
