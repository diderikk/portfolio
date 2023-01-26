import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState, useRef } from "react";
import { validateBasicAuth } from "../../../utils/basic-auth";
import { extractTitleAndDesc } from "../../../utils/markdown-parser";
import { PostType } from "../../../types/post.type";
import { PostImage } from "../../../types/post-image.type";
import { useRouter } from "next/router";
import { FetchPost } from "../../../types/fetch-post.type";
import { fetchPost } from "../../../utils/supabase";
import NotFound from "../../../components/not-found";

export const getServerSideProps: GetServerSideProps<
  FetchPost & { authenticated: boolean; id: string }
> = async (context: GetServerSidePropsContext) => {
  const { req, res } = context;

  const isValidated = await validateBasicAuth(req, res);

  const pid = context?.params?.pid as string;

  const { post, private: isPrivate } = await fetchPost(pid);

  return {
    props: {
      post,
      private: isPrivate,
      authenticated: isValidated,
      id: pid,
      created_at: "",
    },
  };
};

export default function CreatePost({
  post,
  private: isPrivateProp,
  authenticated,
  id,
}: FetchPost & { authenticated: boolean; id: string }) {
  const router = useRouter();
  const [markdownText, setMarkdownText] = useState<string>(post);
  const [images, setImages] = useState<PostImage[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(isPrivateProp);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [title, description] = await extractTitleAndDesc(markdownText);
    const request: PostType = {
      id,
      title,
      description,
      post: markdownText,
      private: isPrivate,
      images: images,
    };
    const res = (
      await (
        await fetch("/api/post", {
          method: "PUT",
          mode: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify(request),
        })
      ).json()
    ).id as string;

    router.push(`/post/${res}`);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const targetFiles: PostImage[] = Array(e.target.files.length).fill(null);
      for (let i = 0; i < e.target.files.length; i++) {
        const data = await toBase64(e.target.files[i]);
        targetFiles[i] = {
          name: e.target.files.item(i)!.name,
          data,
          type: e.target.files.item(i)!.type,
        };
      }
      setImages(targetFiles);
    } else {
      setImages([]);
    }
  };

  const handlePrivateChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate((prevVal) => !prevVal);
  };

  const handleClearImages = () => {
    imageInputRef.current!.value = "";
  };

  const toBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((res, rej) => {
      reader.onloadend = () => {
        const base64String = reader.result! as string;
        res(base64String.replace("data:", "").replace(/^.+,/, ""));
      };
      reader.readAsDataURL(file);
    });
  };

  if (!authenticated) return <NotFound />;

  return (
    <div className="flex flex-col items-center justify-evenly min-h-max">
      <div className="prose mb-20 mx-auto">
        <h1>Add post</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="my-6 min-w-[42rem] flex justify-center flex-col"
      >
        <label
          htmlFor="base-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Markdown
        </label>
        <textarea
          required
          value={markdownText}
          onChange={handleTextChange}
          id="message"
          rows={12}
          className="block p-2.5 mb-10 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Post text"
        ></textarea>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="user_avatar"
        >
          Upload file
        </label>
        <div className="flex flex-row items-center justify-center mb-10">
          <input
            onChange={handleImageChange}
            ref={imageInputRef}
            multiple
            className="block w-full mr-5 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="post images"
            id="image-upload"
            type="file"
          />
          <div
            onClick={() => handleClearImages()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Clear
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer mb-10">
          <input
            type="checkbox"
            value=""
            checked={isPrivate}
            onChange={handlePrivateChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Private
          </span>
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
