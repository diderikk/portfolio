import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ListPost } from "../types/list-post.type";
import { listPosts, listProjects } from "../utils/supabase";
import TypedText from "../components/typed-text";
import { Parallax } from "react-scroll-parallax";
import { StoredProjectType } from "../types/stored-project.type";
import PortfolioSwiper from "../components/portfolio-swiper";
import Timeline from "../components/timeline";
import { useEffect, useRef } from "react";
import { parseMarkdown } from "../utils/markdown-parser";

interface Props {
  posts: ListPost[];
  projects: StoredProjectType[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.headers)}`);

  const posts = await Promise.all(
    (
      await listPosts()
    ).map(async (post) => {
      post.description = await parseMarkdown(post.description);
      return post;
    })
  );
  const projects = await listProjects();
  return {
    props: {
      posts,
      projects,
    },
  };
};

export default function Home({ posts, projects }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const portfolio = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id == "portfolio-title" && portfolio.current)
            portfolio.current!!.classList.add("show");
          entry.target.classList.add("show");
        }
      });
    });
    if (container.current)
      container.current
        .querySelectorAll(".hide")
        .forEach((el) => observer.observe(el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => observer.disconnect();
  }, [container]);

  return (
    <div
      ref={container}
      className="min-w-full flex flex-col items-center prose dark:prose-invert"
    >
      <Parallax className="dark:bg-1 min-h-screen 2xl:min-h-[120vh]">
        <TypedText
          title="open(Diderik) |> read!()"
          description="Software developer and Elixir enthusiast"
        />
      </Parallax>
      <Parallax
        id="portfolio"
        className="dark:bg-2 min-w-full 2xl:min-h-[120vh] min-h-[110vh] prose dark:prose-invert flex justify-center"
      >
        <div className="w-full md:mb-20 px-4 py-20 flex flex-col items-center justify-evenly">
          <h1 id="portfolio-title" className="hide">
            Portfolio
          </h1>
          <div
            ref={portfolio}
            className="hide md:max-h-[90%] flex flex-col items-center justify-evenly"
          >
            <PortfolioSwiper projects={projects} />
          </div>
        </div>
      </Parallax>
      <Parallax className="dark:bg-3 w-full h-56 2xl:h-[28rem]">
        <div />
      </Parallax>
      <Parallax
        id="blog"
        className="min-w-full flex flex-col items-center justify-center prose dark:prose-invert mt-10"
      >
        <h1 className="mb-32 hide">Project Notes</h1>
        <div className="hide">
          <Timeline posts={posts} />
        </div>
      </Parallax>
    </div>
  );
}
