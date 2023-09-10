import { marked } from "marked";
import { PublicUrlType } from "../types/public-url.type";
import moonIcon from "../../public/assets/moon.svg";

export const parse = async (markdownString: string): Promise<string[]> => {
  const [title, description] = await extractTitleAndDesc(markdownString);
  const markdownReplaced = markdownString
    .replace(title, "")
    .replace(description, "");

  const parsedDescription = await parseMarkdown(description);
  const parsedContent = (await parseMarkdown(markdownReplaced)).replace(
    '<h1 id=""></h1>\n',
    ""
  );
  // return new Promise((res, rej) => {
  //   marked.parse(markdownReplaced, (err, html) => {
  //     if (err) rej(err);
  //     else {
  //       res([title, description, html]);
  //     }
  //   });
  // });
  const newHtml = appendHeaderGif(parsedContent);
  return [title, parsedDescription, newHtml];
};

export const parseGitHub = async (markdownString: string, urlPrefix: string): Promise<string> => {
  const [title, _description] = await extractTitleAndDesc(markdownString);
  return (await parseMarkdown(await replaceGitHubImageUrls(markdownString.replace(title, ""), urlPrefix))).replace(
    '<h1 id=""></h1>\n',
    ""
  );
}

const parseMarkdown = async (markdownString: string): Promise<string> => {
  return new Promise((res, rej) => {
    marked.parse(markdownString, (err, html) => {
      if (err) rej(err);
      else {
        res(html);
      }
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

const appendHeaderGif = (htmlString: string): string => {
  let newHtml = htmlString;
  const headerRegex = /^<h2\s*id="[A-Za-z0-9\-]+">([A-Za-z0-9\-\. ]+)<\/h2>/gim;
  const matches = Array.from(htmlString.matchAll(headerRegex));

  matches.forEach((match) => {
    const newHeader =
      `<div class="flex items-center w-full" style="margin: 40px 0 10px 0" >\n` +
      `<h2 style="margin: 0 0 0 0"` +
      match[0].substring(3) +
      `<Image class="w-10" src="https://media.tenor.com/kQW_7FMnJzEAAAAi/pepe-pepejam.gif" alt="Pepejam" style="margin: 0 0 0 10px"/>` +
      `\n</div>`;
    newHtml = newHtml.replaceAll(match[0], newHeader);
  });

  return newHtml;
};

const replaceGitHubImageUrls = async (
  markdownText: string,
  urlPrefix: string
): Promise<string> => {
  let mdTextCopy = markdownText;
  const mdImageRegex =
    /^!\[[a-zA-z0-9.\-/+ \_]*\]\(([a-zA-z0-9.\-/+ \_\.]*)\)$/gim;
  const mdImages = markdownText.matchAll(mdImageRegex);
  const mdImageUrls = Array.from(mdImages);
  mdImageUrls.forEach((url) => {
    mdTextCopy = mdTextCopy.replaceAll(url[1], urlPrefix+url[1].slice(2))
  });

  return mdTextCopy;
};