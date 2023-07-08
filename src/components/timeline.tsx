import { useRouter } from "next/router";
import { ListPost } from "../types/list-post.type";

interface Props {
  posts: ListPost[];
}

const Timeline: React.FC<Props> = ({ posts }) => {
  const router = useRouter();
  const handlePostClick = (id: string) => {
    router.push(`/posts/${id}`);
  };

  return (
    <div className="timeline">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={index % 2 === 0 ? "container left" : "container right"}
        >
          <div className="date">
            {new Date(post.created_at).toUTCString().slice(5, 16)}
          </div>
          <div
            className="content border-zinc-300"
            onClick={() => handlePostClick(post.id)}
          >
            <h2 className="mb-0 underline">{post.title}</h2>
            <p className="overflow-y-hidden max-h-[20vh] md:max-h-[40vh]">
              {post.description.replaceAll("*", "")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
