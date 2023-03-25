import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Image from "next/image";
import { fetchProject } from "../../utils/supabase";

interface Props {
  id: string;
  title: string;
  description: string;
	tags: string[];
	imageUrl: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const pid = context?.params?.pid! as string;
  try {
    const { title, description, tags, imageUrl } = await fetchProject(pid as string);
    
    return {
      props: {
        id: pid,
        title,
        description,
				tags,
				imageUrl
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
	imageUrl
}: Props) {


  return (
    <div className="prose dark:prose-invert min-w-[80%] mx-auto mt-8 flex justify-center flex-col items-center px-4">
			<Image width={400} height={160} src={imageUrl} alt="project image" />
      <h1 className="mb-7">{title}</h1>
			<div className="grid grid-cols-4 gap-4 mb-10 font-bold text-gray-900 dark:text-white">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex justify-center items-center px-4 h-8 bg-slate-300 dark:bg-slate-900 rounded-md cursor-pointer"
            >
              {tag}
            </div>
          ))}
        </div>
      <p>{description}</p>
    </div>
  );
}
