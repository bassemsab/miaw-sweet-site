import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const SIGNED_URL_EXPIRY = 3600;
const BUCKET = "cat-photos";

function createPublicClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const listPhotos = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("photos")
    .select("id, storage_path, caption, value, likes, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const photos = await Promise.all(
    (data || []).map(async (photo) => {
      const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(photo.storage_path, SIGNED_URL_EXPIRY);
      return {
        ...photo,
        signed_url: signed?.signedUrl ?? "",
      };
    }),
  );

  return photos;
});

export const getPhotoStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { count, error: countError } = await supabase.from("photos").select("*", { count: "exact", head: true });
  const { data: agg, error: aggError } = await supabase.from("photos").select("likes, value");

  if (countError) throw new Error(countError.message);
  if (aggError) throw new Error(aggError.message);

  const totalLikes = (agg || []).reduce((sum, row) => sum + (row.likes ?? 0), 0);
  const totalValue = (agg || []).reduce((sum, row) => sum + Number(row.value ?? 0), 0);

  return {
    totalPhotos: count ?? 0,
    totalLikes,
    totalValue: Math.round(totalValue * 100) / 100,
  };
});

export const getSignedUploadUrl = createServerFn({ method: "POST" })
  .validator((input: { filename: string }) =>
    z.object({ filename: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ext = data.filename.split(".").pop() ?? "jpg";
    const path = `uploads/${crypto.randomUUID()}.${ext}`;
    const { data: signed, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path);

    if (error || !signed?.signedUrl) throw new Error(error?.message ?? "Could not create upload URL");

    return { path: signed.path, signedUrl: signed.signedUrl };
  });

export const createPhotoRecord = createServerFn({ method: "POST" })
  .validator((input: { path: string; caption?: string }) =>
    z.object({ path: z.string().min(1), caption: z.string().max(200).optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const initialValue = Math.round((Math.random() * 9 + 1) * 100) / 100;

    const { data: photo, error } = await supabaseAdmin
      .from("photos")
      .insert({ storage_path: data.path, caption: data.caption || null, value: initialValue })
      .select("id, storage_path, caption, value, likes, created_at")
      .single();

    if (error) throw new Error(error.message);
    return photo;
  });

export const likePhoto = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: current, error: fetchError } = await supabaseAdmin
      .from("photos")
      .select("likes, value")
      .eq("id", data.id)
      .single();

    if (fetchError || !current) throw new Error(fetchError?.message ?? "Photo not found");

    const newLikes = (current.likes ?? 0) + 1;
    const newValue = Number(current.value ?? 0) + 0.05;

    const { data: photo, error } = await supabaseAdmin
      .from("photos")
      .update({ likes: newLikes, value: newValue })
      .eq("id", data.id)
      .select("id, storage_path, caption, value, likes, created_at")
      .single();

    if (error) throw new Error(error.message);
    return photo;
  });
