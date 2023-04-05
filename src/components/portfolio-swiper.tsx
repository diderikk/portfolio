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
    <div className="flex w-full items-center">
      <Image
        className="absolute hidden md:block rotate-180 left-0 m-0 h-14 w-14 p-2 rounded-full bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 hover:bg-gray-300 hover:cursor-pointer z-10"
        onClick={() => handleArrowClick(false)}
        src={arrowIcon}
        alt="mode icon"
      />
      <Image
        className="absolute hidden md:block right-0 m-0 h-14 w-14 p-2 rounded-full bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 hover:bg-gray-300 hover:cursor-pointer z-10"
        onClick={() => handleArrowClick(true)}
        src={arrowIcon}
        alt="mode icon"
      />

      <Swiper
        ref={swiperRef}
        spaceBetween={35}
        grabCursor={true}
        effect={"coverflow"}
        speed={1000}
        loop={true}
        centeredSlides={true}
        slidesPerView={3}
        slideToClickedSlide={true}
        coverflowEffect={{
          rotate: 0,
          scale: 1,
          depth: 10,
          modifier: 1,
          slideShadows: false,
        }}
        modules={[EffectCoverflow]}
        className="w-full min-h-[70vh]"
        style={{display: "flex"}}
        onSlideChange={handleInitialSlideChange}
        onTransitionEnd={handleLateSlideChange}
      >
        {projects.map((project, index) => (
          <SwiperSlide
            onClick={() => handleProjectClick(project.id, index)}
            key={project.id}
          >
            <div
              className={
                "overflow-y-hidden p-4 cursor-pointer border-2 min-w-[190px] rounded-md border-gray-200 hover:border-gray-300 " +
                (index !== currentIndex && "opacity-50")
              }
              onClick={() => handleProjectClick(project.id, index)}
            >
              <Image
                src={project.imageUrl}
                alt="Picture of the author"
                width={600}
                height={600}
                className="rounded-md w-32 h-30 mx-auto" // just an example
              />
              <h2 className="mt-0 mb-2 truncate underline">{project.title}</h2>
              <p className="max-h-[25vh] overflow-hidden">
                {project.description}
              </p>
              <div className="max-h-[25vh] grid grid-flow-row-dense auto-row-max grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 font-bold text-gray-900 dark:text-white">
                {project.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex justify-center items-center px-4 h-8 bg-slate-300 dark:bg-slate-900 rounded-md cursor-pointer"
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
