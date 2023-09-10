import React, { useEffect, useState } from "react";

interface Props {
  title: string;
  description: string;
}

const TypedText: React.FC<Props> = ({ title, description }) => {
  const [text1, setText1] = useState<string>("1");
  const [text2, setText2] = useState<string>("1");
  const [begin1, setBegin1] = useState<boolean>(false);
  const [begin2, setBegin2] = useState<boolean>(false);
  const [typingDone, setTypingDone] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      if(text1 == "1") setText1(title[0])
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
          if(text2 == "1") setText2(description[0])
          setBegin2(true);
        }, 800);
      }

      return () => clearTimeout(timeout);
    }
  }, [text1.length, begin1, title, text2, description]);

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
    <div className=" h-full w-full text-lg flex flex-col select-none pb-[20rem] items-center justify-center xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl">
      <div className={"flex justify-center mb-4"}>
        <h2 className={"my-0 " + (!begin1 && "invisible")}>{text1}</h2>
        {!begin2 && (
          <div className="w-0 relative right-0">
            <h2 className="absolute blinking-cursor my-0 max-w-12 overflow-x-hidden">
              {"█"}
            </h2>
          </div>
        )}
      </div>
      <div className={"flex text-md xl:text-3xl md:text-2xl sm:text-xl"}>
        <h6 className={"mt-0 " + (!begin2 && "invisible")}>{text2}</h6>
        {begin2 && !typingDone && (
          <div className="w-0 relative right-0">
            <h6 className="absolute blinking-cursor my-0 max-w-12 overflow-hidden">
              {"█"}
            </h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypedText;
