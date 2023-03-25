import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ListPost } from "../types/list-post.type";
import { listPosts } from "../utils/supabase";
import TypedText from "../components/typed-text";
import { Parallax } from "react-scroll-parallax";

interface Props {
  posts: ListPost[];
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const posts = await listPosts();
  return {
    props: {
      posts,
    },
  };
};

export default function Home({ posts }: Props) {
  const router = useRouter();
  const handlePostClick = (id: string) => {
    router.push(`/post/${id}`);
  };
  return (
    <div className="min-w-full flex flex-col items-center prose dark:prose-invert">
      <Parallax className="h-screen w-full">
        <TypedText
          title='Hello("World") |> IO.puts()'
          description="Software developer and Elixir enthusiast"
        />
      </Parallax>
      <Parallax
        id="blog"
        className="h-screen min-w-full flex flex-col items-center justify-center prose dark:prose-invert"
      >
        <h1>Blog</h1>
        {posts.map((post) => {
          return (
            <div
              key={post.id}
              className="overflow-y-auto p-4 prose my-5 max-w-[90%] min-w-[30%] sm:w-[90%] md:w-[70%] lg:w-[50%] hover:cursor-pointer border-2 rounded-md border-transparent hover:border-gray-300 dark:prose-invert"
              onClick={() => handlePostClick(post.id)}
            >
              <h2 className="mb-0 underline">{post.title}</h2>
              <p>{post.description.replaceAll("*", "")}</p>
            </div>
          );
        })}
      </Parallax>
    </div>
  );
}
