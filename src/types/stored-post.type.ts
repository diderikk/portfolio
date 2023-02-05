import { PostAccess } from "../enums/private.enum";

export type StoredPostType = {
  id: string;
  title: string;
  description: string;
  post: string;
  access: PostAccess;
};
