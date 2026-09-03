"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";
import { INTERPRETER_PHOTO_BUCKET } from "@/lib/interpreter-photos";

const EXPERIENCE_BANDS = new Set([
  "less_than_2",
  "2_to_5",
  "6_to_10",
  "11_plus",
]);

function parseList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalHttpUrl(
  value: FormDataEntryValue | null,
  label: string
) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error();
    }
    return url.toString();
  } catch {
    throw new Error(`${label} must be a valid http or https link.`);
  }
}

export async function saveInterpreterProfileAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const home_address = String(formData.get("home_address") ?? "").trim();
  const service_radius_miles = Number(
    formData.get("service_radius_miles") ?? 25
  );
  const languages = parseList(formData.get("languages"));
  const modalities = (formData.getAll("modalities") as string[]).filter(
    Boolean
  );
  const credentials =
    String(formData.get("credentials") ?? "").trim() || null;

  const certificationAnswer = String(
    formData.get("is_certified") ?? ""
  );

  const is_certified =
    certificationAnswer === "yes"
      ? true
      : certificationAnswer === "no"
        ? false
        : null;

  const certifications = parseList(formData.get("certifications"));
  const licenses = parseList(formData.get("licenses"));
  const specialties = parseList(formData.get("specialties"));

  const rawExperienceBand = String(
    formData.get("experience_band") ?? ""
  );
  const experience_band = rawExperienceBand || null;

  if (experience_band && !EXPERIENCE_BANDS.has(experience_band)) {
    throw new Error("Select a valid experience level.");
  }

  const intro_video_url = parseOptionalHttpUrl(
    formData.get("intro_video_url"),
    "Introduction video"
  );

  const willing_to_mentor =
    formData.get("willing_to_mentor") === "on";

  const willing_to_work_with_students =
    formData.get("willing_to_work_with_students") === "on";

  const pro_bono_commitment =
    String(formData.get("pro_bono_commitment") ?? "").trim() || null;

  const accept = formData.get("accept_pro_bono") === "on";

  let geo = null;

  if (home_address) {
    geo = await geocodeAddress(home_address);

    if (!geo) {
      throw new Error(
        "Could not geocode your home address. Try adding city/state."
      );
    }
  }

  const { data: existingProfile, error: existingProfileError } =
    await supabase
      .from("interpreter_profiles")
      .select("profile_photo_path")
      .eq("profile_id", user.id)
      .maybeSingle();

  if (existingProfileError) {
    throw new Error(existingProfileError.message);
  }

  const photo = formData.get("profile_photo");
  const removePhoto =
    formData.get("remove_profile_photo") === "on";

  let uploadedPhotoPath: string | null = null;
  let nextPhotoPath: string | null | undefined;

  if (photo instanceof File && photo.size > 0) {
    const allowedTypes = new Map([
      ["image/jpeg", "jpg"],
      ["image/png", "png"],
      ["image/webp", "webp"],
    ]);

    const extension = allowedTypes.get(photo.type);

    if (!extension) {
      throw new Error(
        "Profile photo must be a JPG, PNG, or WebP image."
      );
    }

    if (photo.size > 5 * 1024 * 1024) {
      throw new Error("Profile photo must be 5 MB or smaller.");
    }

    uploadedPhotoPath =
      `${user.id}/profile-${Date.now()}.${extension}`;

    const bytes = new Uint8Array(await photo.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(INTERPRETER_PHOTO_BUCKET)
      .upload(uploadedPhotoPath, bytes, {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `Could not upload profile photo: ${uploadError.message}`
      );
    }

    nextPhotoPath = uploadedPhotoPath;
  } else if (removePhoto) {
    nextPhotoPath = null;
  }

  const update: Record<string, unknown> = {
    profile_id: user.id,
    home_address: geo?.formatted ?? home_address,
    service_radius_miles,
    languages: languages.length ? languages : ["ASL"],
    modalities: modalities.length ? modalities : ["in_person"],
    credentials,
    is_certified,
    certifications,
    licenses,
    specialties,
    experience_band,
    intro_video_url,
    willing_to_mentor,
    willing_to_work_with_students,
    pro_bono_commitment,
  };

  if (nextPhotoPath !== undefined) {
    update.profile_photo_path = nextPhotoPath;
  }

  if (geo) {
    update.home_location =
      `SRID=4326;POINT(${geo.longitude} ${geo.latitude})`;
  }

  if (accept && pro_bono_commitment) {
    update.pro_bono_signed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("interpreter_profiles")
    .upsert(update, { onConflict: "profile_id" });

  if (error) {
    if (uploadedPhotoPath) {
      await supabase.storage
        .from(INTERPRETER_PHOTO_BUCKET)
        .remove([uploadedPhotoPath]);
    }

    throw new Error(error.message);
  }

  const previousPhotoPath = existingProfile?.profile_photo_path;

  if (
    nextPhotoPath !== undefined &&
    previousPhotoPath &&
    previousPhotoPath !== nextPhotoPath
  ) {
    const { error: removalError } = await supabase.storage
      .from(INTERPRETER_PHOTO_BUCKET)
      .remove([previousPhotoPath]);

    if (removalError) {
      console.error(
        "Could not remove previous profile photo:",
        removalError
      );
    }
  }

  revalidatePath("/interpreter/profile");
  revalidatePath("/interpreter");
}
