import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { validateBasicAuth } from "../../../utils/basic-auth";
import { FetchPost } from "../../../types/fetch-post.type";
import { fetchPost } from "../../../utils/supabase";
import { PostForm } from "../../../components/post-form";
import { PostAccess } from "../../../enums/private.enum";

export const getServerSideProps: GetServerSideProps<
  FetchPost & { authenticated: boolean; id: string }
> = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;
  console.log(`${req.method} ${req.url}`);

  const isValidated = await validateBasicAuth(req, res);

  const pid = context?.params?.pid as string;

  const { post, access } = await fetchPost(pid);
  const accessEnum = PostAccess[access as keyof typeof PostAccess];
  return {
    props: {
      post,
      access: accessEnum,
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
