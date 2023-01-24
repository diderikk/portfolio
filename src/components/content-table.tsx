import React from "react";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const ContentTable: React.FC<Props> = ({ children, onClick }) => {
  return (
    <div
      className="flex justify-center items-center rounded-lg shadow-xl border dark:border-gray-700 p-4 hover:cursor-pointer hover:opacity-70 select-none"
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};

export default ContentTable;
