"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";

export async function createRequestAction(formData: FormData) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in");

  const title = String(formData.get("title") ?? "").trim();
  const description =
    String(formData.get("description") ?? "").trim() || null;
  const event_type = String(formData.get("event_type") ?? "other");
  const sensitivity =
    formData.get("sensitivity") === "sensitive" ? "sensitive" : "standard";
  const event_address = String(formData.get("event_address") ?? "").trim();
  const event_start = String(formData.get("event_start") ?? "");
  const event_end = String(formData.get("event_end") ?? "");
  const modality = String(formData.get("modality") ?? "in_person");

  const languages_needed = String(
    formData.get("languages_needed") ?? "ASL"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !event_address || !event_start || !event_end) {
    throw new Error("Missing required fields");
  }

  /*
   * Try to geocode the address.
   *
   * IMPORTANT:
   * A temporary Mapbox/geocoding problem should not prevent
   * the request itself from being created.
   */
  let geo: Awaited<ReturnType<typeof geocodeAddress>> = null;

  try {
    geo = await geocodeAddress(event_address);
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  if (!geo) {
    console.warn("Could not geocode the event address:", event_address);
  }

  /*
   * Keep all of the original request fields.
   *
   * When geocoding succeeds:
   * - use the formatted address
   * - save the geographic point
   *
   * When geocoding fails:
   * - preserve exactly what the requestor entered
   * - allow event_location to remain null
   */
  const requestData = {
    requestor_id: user.id,
    title,
    description,
    event_type,
    sensitivity,
    event_address: geo?.formatted ?? event_address,
    event_location: geo
      ? `SRID=4326;POINT(${geo.longitude} ${geo.latitude})`
      : null,
    event_start,
    event_end,
    languages_needed,
    modality,
    status: "open",
  };

  const { data, error } = await supabase
    .from("requests")
    .insert(requestData)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create request:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      requestor_id: user.id,
      event_address,
      geocoded: Boolean(geo),
    });

    /*
     * If your database requires event_location, preserve
     * the original geocoding error instead of returning
     * a confusing database error.
     */
    if (
      !geo &&
      (error.message.toLowerCase().includes("event_location") ||
        error.message.toLowerCase().includes("null value"))
    ) {
      throw new Error("Could not geocode the event address");
    }

    throw new Error(error.message);
  }

  console.log("Request created successfully:", {
    request_id: data.id,
    requestor_id: user.id,
    geocoded: Boolean(geo),
  });

  redirect(`/requestor/requests`);
}
