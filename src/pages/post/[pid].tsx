import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parse } from "../../utils/markdown-parser";
import { fetchPost, incrementViews } from "../../utils/supabase";
import { validateBasicAuth } from "../../utils/basic-auth";
import NotFound from "../../components/not-found";
import { getContentTable } from "../../utils/html-reader";
import ContentTable from "../../components/content-table";
import { ContentTableItem } from "../../types/content-item.type";
import { useEffect, useState } from "react";

interface Props {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  html: string;
  authenticated: boolean;
  contentTable: ContentTableItem[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const pid = context?.params?.pid! as string;
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
            id: pid,
            title: "",
            description: "",
            createdAt: "",
            html: "",
            authenticated: false,
            contentTable: [],
          },
        };
    }
    const [title, description, converted] = await parse(post);
    const contentTable = getContentTable(converted);
    return {
      props: {
        id: pid,
        title,
        description,
        createdAt: new Date(created_at).toUTCString().slice(0, 16),
        html: converted,
        authenticated: true,
        contentTable,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
};

export default function Post({
  id,
  html,
  authenticated,
  title,
  description,
  createdAt,
  contentTable,
}: Props) {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const incrementView = async () => {
    await incrementViews(id);
    localStorage.setItem(id, "true");
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    if (localStorage[id] !== "true") incrementView();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!authenticated) return <NotFound />;
  return (
    <div className="prose dark:prose-invert mx-auto flex justify-center flex-col items-center px-4">
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
      {screenWidth > 1300 && <ContentTable contentTable={contentTable} />}
    </div>
  );
}
