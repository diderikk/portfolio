import { ProjectType } from "./project.type";

export type StoredProjectType = ProjectType & {
  imageUrl: string;
  githubReadme: string | null;
};
