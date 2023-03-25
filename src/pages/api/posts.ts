import type { NextApiRequest, NextApiResponse } from "next";
import { PostAccess } from "../../enums/private.enum";
import { PostType } from "../../types/post.type";
import { validateBasicAuth } from "../../utils/basic-auth";
import { replaceImageUrls } from "../../utils/markdown-parser";
import runMiddleware from "../../utils/middleware";
import { addPost, uploadImages } from "../../utils/supabase";

type Data = {
  id: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (await validateBasicAuth(req, res, true)) {
    try {
      await runMiddleware(req, res);

      if (req.method === "POST" || req.method === "PUT") {
        const body: PostType = req.body;
        const status = req.method === "POST" ? 201 : 200;

        const convertedText = await convertText(body);

        const { id } = await addPost({
          id: body.id,
          title: body.title,
          description: body.description,
          post: convertedText,
          access: PostAccess[body.access],
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

async function convertText(body: PostType): Promise<string> {
  if (body.images.length > 0) {
    const publicUrls = await uploadImages(body.id, body.images);
    return await replaceImageUrls(body.post, publicUrls);
  }
  return body.post;
}
