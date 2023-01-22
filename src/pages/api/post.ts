// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PostType } from "../../types/post.type";
import { validateBasicAuth } from "../../utils/basic-auth";
import { replaceImageUrls } from "../../utils/markdown-parser";
import runMiddleware from "../../utils/middleware";
import { addPost, uploadImages } from "../../utils/supabase";

type Data = {
  id: string;
};
// TODO: add BASIC AUTH
// TODO:
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (await validateBasicAuth(req, res)) {
    try {
      await runMiddleware(req, res);

      if (req.method === "POST" || req.method === "PUT") {
        const body: PostType = req.body;
        const status = req.method === "POST" ? 201 : 200;

        const publicUrls = await uploadImages(body.id, body.images);
        const convertedText = await replaceImageUrls(body.post, publicUrls);

        const id = await addPost({
          id: body.id,
          title: body.title,
          description: body.description,
          post: convertedText,
          private: body.private,
        });

        res.status(status).json({
          id,
        });
      } else {
        res.status(405).end();
      }
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }
}
