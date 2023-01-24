import fs from "fs/promises";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ListPost } from "../types/list-post.type";
import { listPosts } from "../utils/supabase";

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
    <div className="min-w-full flex flex-col items-center">
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="overflow-y-auto p-4 prose my-5 w-[30%] hover:cursor-pointer border-2 rounded-md border-transparent hover:border-gray-300 dark:prose-invert"
            onClick={() => handlePostClick(post.id)}
          >
            <h2 className="mb-0 underline">{post.title}</h2>
            <p>{post.description.replaceAll("*", "")}</p>
          </div>
        );
      })}
    </div>
  );
}
