import { marked } from "marked";

export const parse = async (markdownString: string): Promise<string> => {
  return new Promise((res, rej) => {
    marked.parse(markdownString, (err, html) => {
      if (err) rej(err);
      else res(html);
    });
  });
};
