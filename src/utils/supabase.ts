import { createClient } from "@supabase/supabase-js";
import { AdminType } from "../types/admin.type";
import { FetchPost } from "../types/fetch-post.type";
import { ListPost } from "../types/list-post.type";
import { PostImage } from "../types/post-image.type";
import { PublicUrlType } from "../types/public-url.type";
import { SerializedPostType } from "../types/serialized-post-type.type";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addPost = async (
  postType: SerializedPostType
): Promise<{ id: string }> => {
  const { data, error } = await supabase
    .from("posts")
    .upsert(postType)
    .select("id")
    .single();

  if (error) {
    throw new Error("Error inserting post");
  }

  return data as unknown as { id: string };
};

export const fetchPost = async (id: string): Promise<FetchPost> => {
  const { data, error } = await supabase
    .from("posts")
    .select("post, access, created_at")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Error inserting post");
  }

  return data as unknown as FetchPost;
};

export const listPosts = async (): Promise<ListPost[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description")
    .eq("access", "PUBLIC")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Error fetching posts");

  return data as unknown as ListPost[];
};

export const incrementViews = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc("increment", { row_id: id });

  if (error) throw new Error("Error incrementing views");
};

export const addAdmin = async (
  username: string,
  hash: string,
  salt: string
): Promise<AdminType> => {
  const admin: AdminType = {
    username,
    hash,
    salt,
  };
  const { data, error } = await supabase
    .from("admin")
    .insert(admin)
    .select()
    .single();
  return data as unknown as AdminType;
};

export const fetchAdmin = async (username: string): Promise<AdminType> => {
  const { data, error } = await supabase
    .from("admin")
    .select()
    .eq("username", username)
    .single();
  if (error) {
    throw new Error("Error fetching admin user");
  }

  return data as unknown as AdminType;
};

export const uploadImages = async (
  id: string,
  images: PostImage[]
): Promise<PublicUrlType[]> => {
  const uploads = images.map(async (image) => {
    return await uploadImage(id, image);
  });
  await Promise.all(uploads);

  const publicUrls = images.map(async (image) => {
    return await retrievePublicUrl(id, image.name);
  });

  return Promise.all(publicUrls);
};

const uploadImage = async (id: string, image: PostImage): Promise<void> => {
  const data = Buffer.from(image.data, "base64");
  const { error } = await supabase.storage
    .from("images")
    .upload(`public/${id}/${image.name}`, data, {
      upsert: true,
      contentType: image.type,
    });

  if (error) {
    throw new Error("Error uploading image");
  }
};

const retrievePublicUrl = async (
  id: string,
  imageName: string
): Promise<PublicUrlType> => {
  return new Promise((res, _rej) =>
    res({
      name: imageName,
      url: supabase.storage
        .from("images")
        .getPublicUrl(`public/${id}/${imageName}`).data.publicUrl,
    })
  );
};
