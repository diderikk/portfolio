import { Image } from "./post-image.type";
import { StoredPostType } from "./stored-post.type";

export type PostType = StoredPostType & {
  images: Image[];
};
