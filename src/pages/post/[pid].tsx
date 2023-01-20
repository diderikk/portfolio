import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import fs from "fs/promises";
import {parse} from "../../utils/markdown-parser"

interface StaticProps {
  html: string;
}

export const getStaticPaths: GetStaticPaths<{ pid: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps<any> = async (
  context: GetStaticPropsContext
) => {
  const pid = context?.params?.pid;
  try {
    const file = (await fs.readFile(`src/public/posts/${pid}.md`)).toString();
    const converted = await parse(file);
    console.log(converted);
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
      <pre>
        <code className="language-bash">
          echo &quot;hello&quot;
        </code>
      </pre>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
