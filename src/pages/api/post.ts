// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StoredPostType } from "../../types/stored-post.type";
import runMiddleware from "../../utils/middleware";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    runMiddleware(req, res);

    if (req.method === "POST") {
      const body: StoredPostType = req.body;
    } else {
      res.status(405).end();
    }
  } catch (err) {
    res.status(500).end();
  }
}
