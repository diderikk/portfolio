import { StoredPostType } from "./stored-post.type";

export type PostType = StoredPostType & {
  images: File[];
};
