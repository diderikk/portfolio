import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { PostForm } from "../../components/post-form";
import { PostAccess } from "../../enums/private.enum";
import { FetchPost } from "../../types/fetch-post.type";
import { validateBasicAuth } from "../../utils/basic-auth";

export const getServerSideProps: GetServerSideProps<{
  authenticated: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.headers)}`);

  const isValidated = await validateBasicAuth(req, res);

  return {
    props: {
      authenticated: isValidated,
    },
  };
};

export default function CreatePost({
  authenticated,
}: FetchPost & { authenticated: boolean; id: string | null }) {
  return (
    <PostForm
      authenticated={authenticated}
      access={PostAccess.PUBLIC}
      post=""
      created_at=""
      id={null}
    />
  );
}
