import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { validateBasicAuth } from "../../../utils/basic-auth";
import { FetchPost } from "../../../types/fetch-post.type";
import { fetchPost } from "../../../utils/supabase";
import { PostForm } from "../../../components/post-form";

export const getServerSideProps: GetServerSideProps<
  FetchPost & { authenticated: boolean; id: string }
> = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  const isValidated = await validateBasicAuth(req, res);

  const pid = context?.params?.pid as string;

  const { post, access: access } = await fetchPost(pid);

  return {
    props: {
      post,
      access,
      authenticated: isValidated,
      id: pid,
      created_at: "",
    },
  };
};

export default function CreatePost({
  post,
  access,
  authenticated,
  id,
  created_at,
}: FetchPost & { authenticated: boolean; id: string | null }) {
  return (
    <PostForm
      post={post}
      access={access}
      authenticated={authenticated}
      id={id}
      created_at={created_at}
    />
  );
}
