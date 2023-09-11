import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "OPTION", "POST", "PUT", "DELETE"],
  origin: ["localhost:3000"],
});

function initMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function runMiddleware(req: NextApiRequest, res: NextApiResponse) {
  console.log(`${req.method} ${req.url}`)
  await initMiddleware(req, res, cors);
}

export default runMiddleware;
