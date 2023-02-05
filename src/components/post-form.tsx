import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { PostAccess } from "../enums/private.enum";
import { FetchPost } from "../types/fetch-post.type";
import { PostImage } from "../types/post-image.type";
import { PostType } from "../types/post.type";
import { v4 as uuidv4 } from "uuid";
import { extractTitleAndDesc } from "../utils/markdown-parser";
import NotFound from "./not-found";

export const PostForm: React.FC<
  FetchPost & { authenticated: boolean; id: string | null }
> = ({ post, authenticated, access: accessProp, id: idProp }) => {
  const router = useRouter();
  const [markdownText, setMarkdownText] = useState<string>(post);
  const [images, setImages] = useState<PostImage[]>([]);
  const [access, setAccess] = useState<PostAccess>(accessProp);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [title, description] = await extractTitleAndDesc(markdownText);
    const request: PostType = {
      id: idProp === null ? uuidv4() : idProp,
      title,
      description,
      post: markdownText,
      access,
      images: images,
    };
    const id = (
      await (
        await fetch("/api/post", {
          method: idProp === null ? "POST" : "PUT",
          mode: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          body: JSON.stringify(request),
        })
      ).json()
    ).id as string;

    router.push(`/post/${id}`);
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

  const handleAccessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccess(PostAccess[e.target.value as keyof typeof PostAccess]);
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
      <div className="prose mb-10 mx-auto dark:prose-invert">
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

        <label
          htmlFor="access"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select access type
        </label>
        <select
          id="access"
          className="mb-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={PostAccess[access]}
          onChange={handleAccessChange}
        >
          <option value="PUBLIC">Public</option>
          <option value="HIDDEN">Hidden</option>
          <option value="PRIVATE">Private</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
