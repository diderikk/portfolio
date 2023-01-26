import React from "react";
import { ContentTableItem } from "../types/content-item.type";

interface Props {
  contentTable: ContentTableItem[];
}

const ContentTable: React.FC<Props> = ({ contentTable }: Props) => {
  const toHtmlId = (item: string) => {
    const numberedRegex = /^\d\.\s*/gim;
    return `#${item
      .toLowerCase()
      .replace(numberedRegex, "")
      .split(" ")
      .join("-")}`;
  };
  return (
    <div className="fixed right-40 top-[30%] flex flex-col justify-center items-start rounded-lg border-gray-500 border-2 p-2 px-4">
      {contentTable.map((contentItem) => {
        if (contentItem.indent)
          return (
            <h6 key={contentItem.item} className="my-2 indent-2 text-sm">
              {contentItem.item}
            </h6>
          );
        return (
          <h5 key={contentItem.item} className="my-2">
            <a className=" no-underline" href={toHtmlId(contentItem.item)}>
              {contentItem.item}
            </a>
          </h5>
        );
      })}
    </div>
  );
};

export default ContentTable;
