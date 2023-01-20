import React from "react";
import { useTheme } from "../context/theme";
import sunIcon from "../public/assets/sun.svg";
import moonIcon from "../public/assets/moon.svg";
import Image from "next/image";

// https://codepen.io/alireza82/pen/poRqBOq

const ThemeModeToggler: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <div
      className="flex justify-center items-center rounded-lg shadow-xl border-b-2 p-4 hover:cursor-pointer hover:opacity-70 select-none"
      onClick={() => {
        toggleMode();
      }}
    >
      <Image className="m-0" src={mode ? moonIcon : sunIcon} alt="mode icon" />
    </div>
  );
};

export default ThemeModeToggler;
