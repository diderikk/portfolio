import { GetServerSideProps } from "next";
import { ListPost } from "../types/list-post.type";
import { listPosts, listProjects } from "../utils/supabase";
import TypedText from "../components/typed-text";
import { Parallax } from "react-scroll-parallax";
import { StoredProjectType } from "../types/stored-project.type";
import PortfolioSwiper from "../components/portfolio-swiper";
import Timeline from "../components/timeline";

interface Props {
  posts: ListPost[];
  projects: StoredProjectType[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const posts = await listPosts();
  const projects = await listProjects();
  return {
    props: {
      posts,
      projects,
    },
  };
};

export default function Home({ posts, projects }: Props) {
  return (
    <div className="min-w-full flex flex-col items-center prose dark:prose-invert">
      <Parallax className="h-screen w-full overflow-y-hidden">
        <TypedText
          title="open(Diderik) |> read!()"
          description="Software developer and Elixir enthusiast"
        />
      </Parallax>
      <Parallax
        id="portfolio"
        className="min-h-screen max-h-[120vw] min-w-full md:min-w-[90%] md:max-h-[90%] mb-20 px-4 py-20 flex flex-col items-center justify-evenly prose dark:prose-invert "
      >
        <h1>Portfolio</h1>
        <PortfolioSwiper projects={projects} />
      </Parallax>
      <Parallax
        id="blog"
        className="min-h-screen min-w-full flex flex-col items-center justify-center prose dark:prose-invert "
      >
        <h1 className="mb-32">
          Project Notes</h1>
        <Timeline posts={posts} />
      </Parallax>
    </div>
  );
}
