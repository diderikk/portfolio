import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";
import fs from "fs/promises";
import { parse } from "../../utils/markdown-parser";
import { fetchPost } from "../../utils/supabase";
import { validateBasicAuth } from "../../utils/basic-auth";

interface StaticProps {
  html: string;
}

export const getServerSideProps: GetServerSideProps<any> = async (
  context: GetServerSidePropsContext
) => {
  const pid = context?.params?.pid;
  const { req, res } = context;
  try {
    const { post, private: isPrivate } = await fetchPost(pid as string);
    console.log(isPrivate);
    if (isPrivate) await validateBasicAuth(req, res);
    const converted = await parse(post);
    return {
      props: {
        html: converted,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default function Post({ html }: StaticProps) {
  return (
    <div className="prose dark:prose-invert mx-auto">
      <div
        className="flex justify-center flex-col items-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
