export const getContentTable = (htmlString: string): string[] => {
  const contentTable: string[] = [];
  const headerRegex = /^<h\d\s*id="(\w+)">/gim;
  const listMember = /^<li><p>([A-Za-z0-9 \-\_]*)/gim;
  const matches = Array.from(htmlString.matchAll(headerRegex));

  const splitted = htmlString.split("\n");
  let currentHeaderIndex = 0;
  let insideList = false;

  splitted.forEach((line) => {
    if (headerRegex.test(line))
      contentTable.push(capitalize(matches[currentHeaderIndex][1]));
    else if (line.includes("ol")) {
      insideList = !insideList;
    } else if (listMember.test(line) && insideList) {
      contentTable.push(
        Array.from(line.match(listMember)!)[0].replace("<li><p>", "")
      );
    }
  });

  return contentTable;
};

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
