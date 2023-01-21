import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { validateBasicAuth } from "../../utils/basic-auth";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req, res } = ctx;

  await validateBasicAuth(req, res);

  return {
    props: {},
  };
}

export default function CreatePost() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const targetFiles: File[] = Array(e.target.files.length).fill(null);
      for (var i = 0; i < e.target.files.length; i++) {
        targetFiles[i] = e.target.files.item(i)!;
      }
      setImages(targetFiles);
    } else {
      setImages([]);
    }
  };

  const handlePrivateChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate((prevVal) => !prevVal);
  };

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
        <input
          onChange={handleImageChange}
          multiple
          className="block w-full mb-10 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="post images"
          id="image-upload"
          type="file"
        />
        <label className="relative inline-flex items-center cursor-pointer mb-10">
          <input
            type="checkbox"
            value=""
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
