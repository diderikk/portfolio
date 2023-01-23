import {
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import { parse } from "../../utils/markdown-parser";
import { fetchPost } from "../../utils/supabase";
import { validateBasicAuth } from "../../utils/basic-auth";
import NotFound from "../../components/not-found";

interface StaticProps {
  html: string;
  authenticated: boolean
}

export const getServerSideProps: GetServerSideProps<StaticProps> = async (
  context: GetServerSidePropsContext
) => {
  const pid = context?.params?.pid
  const { req, res } = context;
  try {
    const { post, private: isPrivate } = await fetchPost(pid as string);
    if (isPrivate) {
      if(!await validateBasicAuth(req, res)) return {
        props: {
          html: "",
          authenticated: false
        }
      }
    }
    const converted = await parse(post);
    return {
      props: {
        html: converted,
        authenticated: true
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default function Post({ html, authenticated }: StaticProps) {
  if(!authenticated) return <NotFound />
  return (
    <div className="prose dark:prose-invert mx-auto">
      <div
        className="flex justify-center flex-col items-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
