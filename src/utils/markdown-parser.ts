import { marked } from "marked";
import { PublicUrlType } from "../types/public-url.type";

export const parse = async (markdownString: string): Promise<string> => {
  return new Promise((res, rej) => {
    marked.parse(markdownString, (err, html) => {
      if (err) rej(err);
      else res(html);
    });
  });
};

export const replaceImageUrls = async (
  markdownText: string,
  urls: PublicUrlType[]
): Promise<string> => {
  let mdTextCopy = markdownText;
  const mdImageRegex =
    /^!\[[a-zA-z0-9.\-/+ \_]*\]\(([a-zA-z0-9.\-/+ \_]*)\)$/gim;
  const mdImages = markdownText.matchAll(mdImageRegex);
  const mdImageUrls = Array.from(mdImages);
  mdImageUrls.forEach((url) => {
    urls.forEach((image) => {
      if (url[1].includes(image.name)) {
        mdTextCopy = mdTextCopy.replaceAll(url[1], image.url);
      }
    });
  });

  return mdTextCopy;
};

export const extractTitleAndDesc = async (
  markdownFile: string
): Promise<string[]> => {
  const data = markdownFile.split("\n");

  return [extractTitle(data), extractDescription(data)];
};

const extractTitle = (splittedText: string[]): string => {
  const titleRegex = /^#\s*/gim;
  for (let i = 0; i < splittedText.length; i++) {
    if (titleRegex.test(splittedText[i])) {
      return splittedText[i].replace(titleRegex, "");
    }
  }
  throw Error("Title not found");
};

const extractDescription = (splittedText: string[]): string => {
  const titleRegex = /^#\s*/gim;
  let description = "";
  let isCapturing = false;
  for (let i = 0; i < splittedText.length; i++) {
    if (
      isCapturing &&
      (splittedText[i].includes("#") ||
        (splittedText[i].length === 0 && description.length > 0))
    )
      return description;

    if (splittedText[i].length === 0) continue;
    if (isCapturing) description += splittedText[i] + "\n";
    else if (titleRegex.test(splittedText[i])) isCapturing = true;
  }
  throw Error("Description not found");
};
