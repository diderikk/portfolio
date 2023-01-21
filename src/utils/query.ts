import { createClient } from "@supabase/supabase-js";
import { AdminType } from "../types/admin.type";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const { data, error } = await supabase.from("admin").insert(admin).select();
  console.log(error);
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
