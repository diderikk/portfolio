import { useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { StoredProjectType } from "../types/stored-project.type";
import { Swiper as SwiperType } from "swiper/types";
import { useRouter } from "next/router";
import { EffectCoverflow } from "swiper";
import Image from "next/image";
import arrowIcon from "../../public/assets/arrow-right.svg";

interface Props {
  projects: StoredProjectType[];
}

const PortfolioSwiper: React.FC<Props> = ({ projects }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const swiperRef = useRef<SwiperRef>(null);
  const router = useRouter();

  const handleProjectClick = (id: string, index: number) => {
    if (index === activeIndex) router.push(`/projects/${id}`);
  };

  const handleLateSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleInitialSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.realIndex);
  };

  const handleArrowClick = (next: boolean) => {
    if (next) swiperRef.current!.swiper.slideNext();
    else swiperRef.current!.swiper.slidePrev();
  };

  return (
    <div className="flex w-full min-h-[120vh] items-center">
      {activeIndex !== 0 && (
        <Image
          className="absolute hidden md:block rotate-180 left-3 m-0 h-14 w-14 p-2 rounded-full bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 hover:bg-gray-300 hover:cursor-pointer z-10"
          onClick={() => handleArrowClick(false)}
          src={arrowIcon}
          alt="mode icon"
        />
      )}
      {activeIndex !== projects.length - 1 && (
        <Image
          className="absolute hidden md:block right-3 m-0 h-14 w-14 p-2 rounded-full bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 hover:bg-gray-300 hover:cursor-pointer z-10"
          onClick={() => handleArrowClick(true)}
          src={arrowIcon}
          alt="mode icon"
        />
      )}


      <Swiper
        ref={swiperRef}
        grabCursor={true}
        effect={"coverflow"}
        speed={1000}
        loop={false}
        centeredSlides={true}
        slidesPerView={2}
        slideToClickedSlide={true}
        coverflowEffect={{
          rotate: 0,
          scale: 1,
          depth: 10,
          modifier: 1,
          slideShadows: false,
        }}
        modules={[EffectCoverflow]}
        className="w-[100vw] min-h-[70vh] max-h-[100vh] xl:mx-[43]"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSlideChange={handleInitialSlideChange}
        onTransitionEnd={handleLateSlideChange}
      >
        {projects.map((project, index) => (
          <SwiperSlide
            key={project.id}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "grab"
            }}
          >
            <div
              className={
                "dark:bg-dark bg-white 2xl:max-w-[45%] xl:max-w-[60%] lg:max-w-[70%] max-w-[100%] 2xl:h-[60vh] h-[50vh] flex flex-col justify-between items-center p-1 cursor-pointer border-2 min-w-[190px]  rounded-md border-gray-200 hover:border-gray-300 " +
                (index !== currentIndex && "opacity-50")
              }
              onClick={() => handleProjectClick(project.id, index)}
            >
              <div 
              className="overflow-y-hidden">
                <Image
                  src={project.imageUrl}
                  alt="Picture of the author"
                  width={500}
                  height={500}
                  className="rounded-md w-full mx-auto mt-0 mb-2 overflow-y-hidden"
                />
                <div className="px-2">
                  <h2 className="mt-0 mb-2 truncate underline text-lg lg:text-xl">
                    {project.title}
                  </h2>
                  <p className="max-h-[30vh] text-sm lg:text-base overflow-hidden">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="max-h-[30vh] shrink-0 p-4 grid grid-flow-row-dense auto-row-max grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 font-bold text-gray-900 dark:text-white">
                {project.tags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="flex text-xs justify-center items-center px-4 h-8 bg-slate-300 dark:bg-slate-900 rounded-md cursor-pointer"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PortfolioSwiper;
