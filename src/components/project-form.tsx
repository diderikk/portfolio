import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { FetchPost } from "../types/fetch-post.type";
import { Image } from "../types/post-image.type";
import { v4 as uuidv4 } from "uuid";
import NotFound from "./not-found";
import { InputProjectType } from "../types/input-post-type.type";

export const ProjectForm: React.FC<
  FetchPost & { authenticated: boolean; id: string | null }
> = ({ post, authenticated, access: accessProp, id: idProp }) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>(post);
  const [description, setDescription] = useState<string>(post);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [image, setImage] = useState<Image>();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ensuredImage = image!;
    const request: InputProjectType = {
      id: idProp === null ? uuidv4() : idProp,
      title,
      description,
      tags,
      image: ensuredImage,
      websiteUrl,
      githubUrl,
    };

    const id = (
      await (
        await fetch("/api/projects", {
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

    router.push(`/projects/${id}`);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleGithubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(e.target.value);
  };

  const handleWebsiteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsiteUrl(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = await toBase64(e.target.files[0]);
      const targetFile = {
        name: e.target.files.item(0)!.name,
        data,
        type: e.target.files.item(0)!.type,
      };
      setImage(targetFile);
    } else {
      setImage(undefined);
    }
  };

  const handleClearImages = () => {
    imageInputRef.current!.value = "";
  };

  const handleAddTag = () => {
    setTags((prev) => [tagInput, ...prev]);
    setTagInput("");
  };

  const handleTagPress = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
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
    <div className="flex flex-col items-center justify-evenly min-h-max mt-8">
      <div className="prose mb-5 mx-auto dark:prose-invert">
        <h1>Add project</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="my-6 min-w-[42rem] flex justify-center flex-col"
      >
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Title
        </label>
        <input
          required
          value={title}
          onChange={handleTitleChange}
          id="title"
          className="block p-2.5 mb-5 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Project title"
        />
        <label
          htmlFor="description"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Description
        </label>
        <textarea
          required
          value={description}
          onChange={handleDescriptionChange}
          id="description"
          rows={6}
          className="block p-2.5 mb-5 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Project description"
        ></textarea>
        <label
          htmlFor="github"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Github URL
        </label>
        <input
          required
          type="url"
          value={githubUrl}
          onChange={handleGithubUrlChange}
          id="github"
          className="block p-2.5 mb-5 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Github URL"
        />
        <label
          htmlFor="website"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Website URL
        </label>
        <input
          type="url"
          value={websiteUrl}
          onChange={handleWebsiteUrlChange}
          id="website"
          className="block p-2.5 mb-5 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="Website URL"
        />
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="user_avatar"
        >
          Project image
        </label>
        <div className="flex flex-row items-center justify-center mb-5">
          <input
            onChange={handleImageChange}
            ref={imageInputRef}
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
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="tags"
        >
          Tags
        </label>
        <div id="tags" className="flex flex-row items-center justify-center">
          <input
            value={tagInput}
            onChange={handleTagChange}
            id="tag"
            className="block p-2.5 mr-5 resize-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Tag"
          />
          <div
            onClick={() => handleAddTag()}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            +
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 font-bold text-gray-900 dark:text-white">
          {tags.map((tag) => (
            <div
              key={tag}
              onClick={() => handleTagPress(tag)}
              className="flex justify-center items-center px-4 w-22 h-10 mt-5 bg-green-500 mr-5 rounded-md cursor-pointer"
            >
              {tag}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-10 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
