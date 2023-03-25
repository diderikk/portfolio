import { useRouter } from "next/router";
import React from "react";
import { useTheme } from "../context/theme";
import ThemeModeToggler from "./header-button";
import sunIcon from "../../public/assets/sun.svg";
import moonIcon from "../../public/assets/moon.svg";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Layout({ children }: any) {
  const { mode, toggleMode } = useTheme();
  const router = useRouter();

  const handleBackClick = () => {
    if (router.pathname.includes("post")) router.push("/#blog");
    else router.back();
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-dark">
      <nav className="flex px-[10%] justify-around items-center bg-white-100 py-2 border-b-2">
        {router.pathname.includes("post") ? (
          <ThemeModeToggler onClick={handleBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={mode ? "white" : "currentColor"}
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </ThemeModeToggler>
        ) : (
          <a href="https://github.com/diderikk" className="flex align-center">
            <FontAwesomeIcon
              icon={faGithub}
              className="w-10 h-10 hover:cursor-pointer"
              href="https://github.com/diderikk"
            />
          </a>
        )}

        <div className="container mx-auto flex justify-center prose dark:prose-invert">
          <h2>diderikk</h2>
        </div>

        <ThemeModeToggler onClick={toggleMode}>
          <Image
            className="m-0"
            src={mode ? moonIcon : sunIcon}
            alt="mode icon"
          />
        </ThemeModeToggler>
        {/* <a href="https://github.com/diderikk" className="flex align-center">
            <FontAwesomeIcon
              icon={faGithub}
              className="w-10 h-10 hover:cursor-pointer"
              href="https://github.com/diderikk"
            />
          </a> */}

        {/* <Image src={mode ? moonIcon : sunIcon} alt="mode icon" /> */}
      </nav>
      <main className="container mx-auto flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
