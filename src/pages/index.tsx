import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ListPost } from "../types/list-post.type";
import { listPosts, listProjects } from "../utils/supabase";
import TypedText from "../components/typed-text";
import { Parallax } from "react-scroll-parallax";
import { StoredProjectType } from "../types/stored-project.type";
import Image from "next/image";

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

  const handleProjectClick = (id: string) => {
    router.push(`/projects/${id}`);
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
        <div className="lg:grid lg:grid-cols-2 lg:gap-3 flex flex-col items-center">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-y-auto p-4 my-5 hover:cursor-pointer border-2 rounded-md border-gray-200 hover:border-gray-300"
              onClick={() => handleProjectClick(project.id)}
            >
              <Image
                src={project.imageUrl}
                alt="Picture of the author"
                width={600}
                height={600}
                className="rounded-md w-32 h-30 mx-auto" // just an example
              />
              <h2 className="mt-0 mb-2 underline">{project.title}</h2>
              <p>{project.description}</p>
              <div className="grid grid-flow-row-dense auto-row-max grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 font-bold text-gray-900 dark:text-white">
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
          ))}
        </div>
      </Parallax>
    </div>
  );
}
