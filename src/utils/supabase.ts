import { createClient } from "@supabase/supabase-js";
import { AdminType } from "../types/admin.type";
import { ListPost } from "../types/list-post.type";
import { Image } from "../types/post-image.type";
import { PublicUrlType } from "../types/public-url.type";
import { SerializedPostType } from "../types/serialized-post-type.type";
import { StoredProjectType } from "../types/stored-project.type";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addPost = async (
  post: SerializedPostType
): Promise<{ id: string }> => {
  const { data, error } = await supabase
    .from("posts")
    .upsert(post)
    .select("id")
    .single();

  if (error) {
    throw new Error("Error inserting post");
  }

  return data as unknown as { id: string };
};

export const addProject = async (
  project: StoredProjectType
): Promise<{ id: string }> => {
  const { data, error } = await supabase
    .from("projects")
    .upsert(project)
    .select("id")
    .single();

  if (error) {
    throw new Error("Error inserting project");
  }

  return data as unknown as { id: string };
};

export const fetchPost = async (
  id: string
): Promise<SerializedPostType & { created_at: string }> => {
  const { data, error } = await supabase
    .from("posts")
    .select("post, access, created_at")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Error inserting post");
  }

  return data as unknown as SerializedPostType & { created_at: string };
};

export const fetchProject = async (id: string): Promise<StoredProjectType> => {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Error inserting post");
  }

  return data as unknown as StoredProjectType;
};

export const listPosts = async (): Promise<ListPost[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, created_at")
    .eq("access", "PUBLIC")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Error fetching posts");

  return data as unknown as ListPost[];
};

export const listProjects = async (): Promise<StoredProjectType[]> => {
  const { data, error } = await supabase.from("projects").select();

  if (error) throw new Error("Error fetching posts");

  return data as unknown as StoredProjectType[];
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
  images: Image[]
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

const uploadImage = async (id: string, image: Image): Promise<void> => {
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
