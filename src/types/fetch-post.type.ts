import { PostAccess } from "../enums/private.enum";

export type FetchPost = {
  access: PostAccess;
  post: string;
  created_at: string;
};
