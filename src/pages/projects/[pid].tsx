import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import { fetchProject } from "../../utils/supabase";
import { parseGitHub } from "../../utils/markdown-parser";

interface Props {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  websiteUrl: string | null;
  githubUrl: string | null;
  readme: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const pid = context?.params?.pid! as string;
  try {
    const {
      title,
      description,
      tags,
      imageUrl,
      githubUrl,
      websiteUrl,
      githubReadme,
    } = await fetchProject(pid as string);

    let parsedReadme = null;
    if (githubReadme != null) {
      const markdown = await (await fetch(`${githubReadme}README.md`)).text();
      console.log(`${githubReadme}README.md`)
      parsedReadme = await parseGitHub(
        markdown,
        githubReadme
      );
      console.log(parsedReadme)
    }

    return {
      props: {
        id: pid,
        title,
        description,
        tags,
        imageUrl,
        githubUrl,
        websiteUrl,
        readme: parsedReadme,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
};

export default function Project({
  id,
  title,
  description,
  tags,
  imageUrl,
  githubUrl,
  websiteUrl,
  readme,
}: Props) {
  return (
    <div className="prose dark:prose-invert min-w-[80%] mx-auto mt-8 flex justify-center flex-col items-center px-4 pb-10">
      <Image width={400} height={160} src={imageUrl} alt="project image" />
      <h1 className="mb-7">{title}</h1>
      <div className="grid grid-cols-4 gap-4 mb-5 font-bold text-gray-900 dark:text-white">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex text-xs md:text-sm justify-center items-center px-4 h-8 bg-slate-300 dark:bg-slate-900 rounded-md cursor-pointer"
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center mb-5">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-zinc-900 mx-5 hover:bg-zinc-700 flex justify-center items-center text-white font-bold py-2 px-4 mt-10 rounded hover:cursor-pointer no-underline"
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="w-5 h-5 mr-3 hover:cursor-pointer"
            />
            GitHub
          </a>
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-zinc-100 border-2 border-zinc-300 mx-5 hover:bg-zinc-300 flex justify-center items-center text-black font-bold py-2 px-4 mt-10 rounded hover:cursor-pointer no-underline"
          >
            Website
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 ml-3"
              viewBox="0 0 512 512"
            >
              <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z" />
            </svg>
          </a>
        )}
      </div>
      {readme != null ? (
        <div
          className="prose dark:prose-invert mt-7 flex justify-center flex-col min-w-[30%] xs:min-w-[100%] sm:min-w-[100%] md:min-w-[100%] lg:min-w-[60%]"
          dangerouslySetInnerHTML={{ __html: readme }}
        />
      ) : (
        <p className="lg:text-lg">{description}</p>
      )}
    </div>
  );
}
