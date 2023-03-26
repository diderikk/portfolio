import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ListPost } from "../types/list-post.type";
import { listPosts, listProjects } from "../utils/supabase";
import TypedText from "../components/typed-text";
import { Parallax } from "react-scroll-parallax";
import { StoredProjectType } from "../types/stored-project.type";
import PortfolioSwiper from "../components/portfolio-swiper";

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
  const router = useRouter();
  const handlePostClick = (id: string) => {
    router.push(`/posts/${id}`);
  };



  return (
    <div className="min-w-full flex flex-col items-center prose dark:prose-invert">
      <Parallax className="h-screen w-full overflow-y-hidden">
        <TypedText
          title="open(Diderik) |> read!()"
          description="Software developer and Elixir enthusiast"
        />
      </Parallax>
      <Parallax
        id="blog"
        className="overflow-y-hidden h-screen min-w-full mb-10 py-20 flex flex-col items-center justify-start prose dark:prose-invert"
      >
        <h1>Blog</h1>
        <div className="overflow-y-auto flex flex-col items-center justify-start">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 prose my-5 max-w-[90%] min-w-[30%] sm:w-[90%] md:w-[70%] lg:w-[50%] hover:cursor-pointer border-2 rounded-md border-transparent hover:border-gray-300 dark:prose-invert"
              onClick={() => handlePostClick(post.id)}
            >
              <h2 className="mb-0 underline">{post.title}</h2>
              <p>{post.description.replaceAll("*", "")}</p>
            </div>
          ))}
        </div>
      </Parallax>
      <Parallax
        id="portfolio"
        className="min-h-screen min-w-full px-4 py-20 flex flex-col items-center justify-start prose dark:prose-invert "
      >
        <h1>Portfolio</h1>
        <PortfolioSwiper projects={projects} />
      </Parallax>
    </div>
  );
}
