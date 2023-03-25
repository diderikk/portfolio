import React, { useEffect, useState } from "react";

interface Props {
  title: string;
  description: string;
}

const TypedText: React.FC<Props> = ({ title, description }) => {
  const [text1, setText1] = useState<string>("");
  const [text2, setText2] = useState<string>("");
  const [begin1, setBegin1] = useState<boolean>(false);
  const [begin2, setBegin2] = useState<boolean>(false);
  const [typingDone, setTypingDone] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setBegin1(true);
    }, 2500);
  });
  useEffect(() => {
    if (begin1) {
      const timeout = setTimeout(() => {
        setText1(title.slice(0, text1.length + 1));
      }, 150);

      if (title.length === text1.length) {
        setTimeout(() => {
          setBegin2(true);
        }, 800);
      }

      return () => clearTimeout(timeout);
    }
  }, [text1.length, begin1, title]);

  useEffect(() => {
    if (begin2) {
      const timeout = setTimeout(() => {
        setText2(description.slice(0, text2.length + 1));
      }, 75);

      if (description.length === text2.length) {
        setTimeout(() => {
          setTypingDone(true);
        }, 2000);
      }

      return () => clearTimeout(timeout);
    }
  }, [begin2, description, text2.length]);

  return (
    <div className="h-full  flex flex-col select-none pb-40 items-center justify-center text-5xl">
      <div className="flex mb-4">
        <h2 className="my-0">{text1}</h2>
        {!begin2 && (
          <h2 className="blinking-cursor my-0 w-12 overflow-x-hidden">{"█"}</h2>
        )}
      </div>
      {begin2 && (
        <div className="flex text-4xl">
          <h6 className="mt-0">{text2}</h6>
          {!typingDone && (
            <h5 className="blinking-cursor my-0 w-12 overflow-x-hidden">
              {"█"}
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default TypedText;
