import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { createInterpreterPhotoUrl } from "@/lib/interpreter-photos";
import { saveInterpreterProfileAction } from "./actions";

export default async function InterpreterProfilePage() {
  const profile = await requireProfile();
  const supabase = createSupabaseServerClient();

  const { data: row } = await supabase
    .from("interpreter_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const profilePhotoUrl = await createInterpreterPhotoUrl(
    supabase,
    row?.profile_photo_path
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">
        My interpreter profile
      </h1>

      <p className="text-ink-muted mt-1">
        This information helps us match you with requests close to home and
        appropriate to your skills.
      </p>

      <form
        action={saveInterpreterProfileAction}
        encType="multipart/form-data"
        className="card p-6 mt-6 space-y-4"
      >
        <div>
          <label className="label" htmlFor="home_address">
            Home address
          </label>

          <input
            id="home_address"
            name="home_address"
            required
            className="input"
            defaultValue={row?.home_address ?? ""}
            placeholder="Street, City, State"
          />

          <p className="text-xs text-ink-muted mt-1">
            Used to compute distance and travel time. Your full address is
            never shown to requestors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              className="label"
              htmlFor="service_radius_miles"
            >
              Service radius (miles)
            </label>

            <input
              id="service_radius_miles"
              name="service_radius_miles"
              type="number"
              min={1}
              max={500}
              required
              defaultValue={row?.service_radius_miles ?? 25}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="languages">
              Languages
            </label>

            <input
              id="languages"
              name="languages"
              defaultValue={(row?.languages ?? ["ASL"]).join(", ")}
              className="input"
              placeholder="ASL, ProTactile, etc."
            />
          </div>
        </div>

        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-2 text-sm font-medium">
            Modalities
          </legend>

          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="modalities"
                value="in_person"
                defaultChecked={
                  row?.modalities?.includes("in_person") ?? true
                }
              />
              In person
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="modalities"
                value="video"
                defaultChecked={
                  row?.modalities?.includes("video") ?? false
                }
              />
              Video
            </label>
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="credentials">
            Credentials
          </label>

          <input
            id="credentials"
            name="credentials"
            className="input"
            defaultValue={row?.credentials ?? ""}
            placeholder="RID NIC, BEI, EIPA, etc."
          />
        </div>

        <fieldset className="rounded-xl border border-slate-200 p-4 space-y-4">
          <legend className="px-2 text-sm font-medium">
            Qualifications and experience
          </legend>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="is_certified">
                Are you currently certified?
              </label>

              <select
                id="is_certified"
                name="is_certified"
                className="input"
                defaultValue={
                  row?.is_certified === true
                    ? "yes"
                    : row?.is_certified === false
                      ? "no"
                      : ""
                }
              >
                <option value="">Select an answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label
                className="label"
                htmlFor="experience_band"
              >
                Interpreting experience
              </label>

              <select
                id="experience_band"
                name="experience_band"
                className="input"
                defaultValue={row?.experience_band ?? ""}
              >
                <option value="">
                  Select an experience level
                </option>
                <option value="less_than_2">
                  Less than 2 years
                </option>
                <option value="2_to_5">2–5 years</option>
                <option value="6_to_10">6–10 years</option>
                <option value="11_plus">11+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="certifications">
              Certifications
            </label>

            <input
              id="certifications"
              name="certifications"
              className="input"
              defaultValue={(row?.certifications ?? []).join(", ")}
              placeholder="RID NIC, CDI, BEI, EIPA"
            />

            <p className="text-xs text-ink-muted mt-1">
              Separate multiple certifications with commas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="licenses">
                Licenses
              </label>

              <input
                id="licenses"
                name="licenses"
                className="input"
                defaultValue={(row?.licenses ?? []).join(", ")}
                placeholder="State license or permit"
              />
            </div>

            <div>
              <label className="label" htmlFor="specialties">
                Specialties
              </label>

              <input
                id="specialties"
                name="specialties"
                className="input"
                defaultValue={(row?.specialties ?? []).join(", ")}
                placeholder="DeafBlind, medical, legal"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 p-4 space-y-4">
          <legend className="px-2 text-sm font-medium">
            Profile media
          </legend>

          <div>
            <label className="label" htmlFor="profile_photo">
              Profile photo
            </label>

            {profilePhotoUrl && (
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={profilePhotoUrl}
                  alt={`${profile.full_name} profile`}
                  className="h-20 w-20 rounded-full border border-slate-200 object-cover"
                />

                <label className="flex items-center gap-2 text-sm text-ink-muted">
                  <input
                    type="checkbox"
                    name="remove_profile_photo"
                  />
                  Remove current photo
                </label>
              </div>
            )}

            <input
              id="profile_photo"
              name="profile_photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="input"
            />

            <p className="text-xs text-ink-muted mt-1">
              JPG, PNG, or WebP. Maximum size 5 MB. Coordinators and admins can
              view it; requesters see it only when you are proposed for their
              request.
            </p>
          </div>

          <div>
            <label
              className="label"
              htmlFor="intro_video_url"
            >
              Introduction video link
            </label>

            <input
              id="intro_video_url"
              name="intro_video_url"
              type="url"
              className="input"
              defaultValue={row?.intro_video_url ?? ""}
              placeholder="https://example.com/video"
            />
          </div>

          <p className="text-xs text-ink-muted">
            Only add links you are comfortable sharing with coordinators.
          </p>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 p-4 space-y-3">
          <legend className="px-2 text-sm font-medium">
            Mentorship and student support
          </legend>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="willing_to_mentor"
              defaultChecked={row?.willing_to_mentor ?? false}
              className="mt-1"
            />

            <span>
              I am willing to mentor another interpreter.
            </span>
          </label>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="willing_to_work_with_students"
              defaultChecked={
                row?.willing_to_work_with_students ?? false
              }
              className="mt-1"
            />

            <span>
              I am willing to work with approved interpreting students.
            </span>
          </label>
        </fieldset>

        <div>
          <label
            className="label"
            htmlFor="pro_bono_commitment"
          >
            Your pro bono commitment statement
          </label>

          <textarea
            id="pro_bono_commitment"
            name="pro_bono_commitment"
            className="input min-h-[96px]"
            defaultValue={row?.pro_bono_commitment ?? ""}
            placeholder="A few sentences about why you give pro bono time and what you'll offer the community."
          />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="accept_pro_bono"
            defaultChecked={!!row?.pro_bono_signed_at}
            className="mt-1"
          />

          <span>
            I accept the pro bono terms — I will not invoice for assignments
            taken through this platform, I will respect the privacy of every
            requestor, and I will recuse myself from any assignment where I
            become aware of a conflict.
          </span>
        </label>

        <button className="btn-primary w-full">
          Save profile
        </button>
      </form>
    </div>
  );
}
