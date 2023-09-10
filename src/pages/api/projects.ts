import type { NextApiRequest, NextApiResponse } from "next";
import { InputProjectType } from "../../types/input-post-type.type";
import { validateBasicAuth } from "../../utils/basic-auth";
import runMiddleware from "../../utils/middleware";
import { addProject, uploadImages } from "../../utils/supabase";

type Data = {
  id: string;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (await validateBasicAuth(req, res, true)) {
    try {
      await runMiddleware(req, res);

      if (req.method === "POST" || req.method === "PUT") {
        const body: InputProjectType = req.body;
        const status = req.method === "POST" ? 201 : 200;

        const uploadedImage = (await uploadImages(body.id, [body.image]))[0];

        const { id } = await addProject({
          id: body.id,
          title: body.title,
          description: body.description,
          tags: body.tags,
          imageUrl: uploadedImage.url,
          githubUrl: body.githubUrl,
          websiteUrl: body.websiteUrl,
          githubReadme: null
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
