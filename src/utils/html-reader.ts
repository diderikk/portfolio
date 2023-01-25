import { ContentTableItem } from "../types/content-item.type";

export const getContentTable = (htmlString: string): ContentTableItem[] => {
  const contentTable: ContentTableItem[] = [];
  const headerRegex = /^<h(\d)\s*id="[A-Za-z0-9\-]+">([A-Za-z0-9\- ]+)/gim;
  const listMember = /^<li><p>([A-Za-z0-9 \-\_]*)/gim;
  const matches = Array.from(htmlString.matchAll(headerRegex));

  const splitted = htmlString.split("\n");
  let currentHeaderIndex = 0;
  let insideOrderedList = false;
  let orderListIndex = 1;

  splitted.forEach((line) => {
    if (headerRegex.test(line)) {
      contentTable.push({
        item: capitalize(matches[currentHeaderIndex][2]),
        indent: matches[currentHeaderIndex++][1] === "3",
      });
    } else if (line.includes("ol")) {
      insideOrderedList = !insideOrderedList;
      orderListIndex = 1;
    } else if (listMember.test(line) && insideOrderedList) {
      contentTable.push({
        item: `${orderListIndex++}. ${Array.from(
          line.match(listMember)!
        )[0].replace("<li><p>", "")}`,
        indent: true,
      });
    }
  });

  return contentTable;
};

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
