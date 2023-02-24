import { ContentTableItem } from "../types/content-item.type";

export const getContentTable = (htmlString: string): ContentTableItem[] => {
  const contentTable: ContentTableItem[] = [];
  const headerRegex = /^<h(\d)\s*id="[A-Za-z0-9\-]+">([A-Za-z0-9\- ]+)/gim;
  const matches = Array.from(htmlString.matchAll(headerRegex));

  matches.forEach(match => {
    contentTable.push({
      item: capitalize(match[2]),
      indent: match[1] === "3",
    });
  })
  
  return contentTable;
};

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
