import type { SupabaseClient } from "@supabase/supabase-js";

export const INTERPRETER_PHOTO_BUCKET = "interpreter-profile-photos";

export async function createInterpreterPhotoUrl(
  supabase: SupabaseClient,
  path: string | null | undefined
) {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(INTERPRETER_PHOTO_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error("Could not create interpreter photo URL:", error);
    return null;
  }

  return data.signedUrl;
}
