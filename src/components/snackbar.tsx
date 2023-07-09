import Image from "next/image";
import nervousImage from "../../public/assets/nervous.png";
import suspiciousImage from "../../public/assets/sus.jpg";
import { useSnackBar } from "../context/snackbar-context";
import { useEffect, useRef } from "react";

interface Props {}

const Snackbar: React.FC<Props> = ({}) => {
  const { state, dispatch } = useSnackBar();
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    dispatch({ type: "disabled" });
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.remove("snackbar-fade");
      setTimeout(() => {
        document.getElementById("snackbar")?.classList.add("snackbar-fade");
      }, 500);
    }
  }, [state]);

  return state.show || state.fadeOut ? (
    <div
      ref={ref}
      id="snackbar"
      onClick={handleClick}
      className={
        "dark:bg-dark bg-white hover:border-4 cursor-pointer flex justify-center items-center text-xs fixed bottom-10 left-0 right-0 mx-auto h-[8vh] w-[85vw] md:w-[45vw] lg:w-[35vw] prose dark:prose-invert rounded-lg border-2"
      }
    >
      {state.darkMode !== false ? (
        <div className="flex justify-center items-center">
          <h3 className="my-0">{state.description}</h3>
          <Image
            className="h-14 w-14 rounded-full my-0 ml-2"
            src={suspiciousImage}
            alt="winnie the pooh dandy image"
          />
        </div>
      ) : (
        <Image
          className="w-14 rounded-full ml-2"
          src={nervousImage}
          alt="sus image"
        />
      )}
    </div>
  ) : (
    <div />
  );
};

export default Snackbar;
