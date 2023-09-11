import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { ProjectForm } from "../../components/project-form";
import { PostAccess } from "../../enums/private.enum";
import { FetchPost } from "../../types/fetch-post.type";
import { validateBasicAuth } from "../../utils/basic-auth";

export const getServerSideProps: GetServerSideProps<{
  authenticated: boolean;
}> = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;
  console.log(`${req.method} ${req.url}`)

  const isValidated = await validateBasicAuth(req, res);

  return {
    props: {
      authenticated: isValidated,
    },
  };
};

export default function CreateProject({
  authenticated,
}: FetchPost & { authenticated: boolean; id: string | null }) {
  return (
    <ProjectForm
      authenticated={authenticated}
      access={PostAccess.PUBLIC}
      post=""
      created_at=""
      id={null}
    />
  );
}
