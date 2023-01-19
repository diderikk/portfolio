import fs from "fs/promises";
import { GetStaticProps } from "next";

interface StaticProps {
  files: string[];
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const dirFiles = await fs.readdir("src/public/posts");
  const files = dirFiles.filter(file => file.endsWith(".md")).map(file =>  file.split(".")[0])
  return {
    props: {
      files,
    },
  };
};

export default function Home({files}: StaticProps) {
  return <div>
    {files.map((file) => {
      return <h1 key={file}>{file}</h1>
    })}
  </div>;
}
