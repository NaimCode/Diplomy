// var axios = require('axios');

import { NextApiRequest, NextApiResponse } from "next";
import { cloudy } from "../../utils/cloudinary";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body.id
  
  res.status(200).send({ });
};
