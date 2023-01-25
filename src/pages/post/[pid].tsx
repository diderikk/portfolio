import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parse } from "../../utils/markdown-parser";
import { fetchPost } from "../../utils/supabase";
import { validateBasicAuth } from "../../utils/basic-auth";
import NotFound from "../../components/not-found";
import { getContentTable } from "../../utils/html-reader";
import ContentTable from "../../components/content-table";
import { ContentTableItem } from "../../types/content-item.type";

interface Props {
  title: string;
  description: string;
  createdAt: string;
  html: string;
  authenticated: boolean;
  contentTable: ContentTableItem[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const pid = context?.params?.pid;
  const { req, res } = context;
  try {
    const {
      post,
      private: isPrivate,
      created_at,
    } = await fetchPost(pid as string);
    if (isPrivate) {
      if (!(await validateBasicAuth(req, res)))
        return {
          props: {
            title: "",
            description: "",
            createdAt: "",
            html: "",
            authenticated: false,
            contentTable: []
          },
        };
    }
    const [title, description, converted] = await parse(post);
    console.log(converted);
    const contentTable = getContentTable(converted);
    console.log(contentTable)
    return {
      props: {
        title,
        description,
        createdAt: new Date(created_at).toUTCString().slice(0, 16),
        html: converted,
        authenticated: true,
        contentTable
      },
    };
  } catch (err) {
    console.log(err)
    return {
      notFound: true,
    };
  }
};

export default function Post({
  html,
  authenticated,
  title,
  description,
  createdAt,
  contentTable
}: Props) {
  if (!authenticated) return <NotFound />;
  return (
    <div className="prose dark:prose-invert mx-auto flex justify-center flex-col items-center">
      <h1 className="mb-0">{title}</h1>
      <p>{createdAt}</p>
      <div
        className="mb-0 border-b-2"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div
        className="flex justify-center flex-col mt-0 min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ContentTable contentTable={contentTable} />
    </div>
  );
}
