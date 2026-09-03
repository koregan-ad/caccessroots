"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  INTERPRETER_PHOTO_BUCKET,
  INTERPRETER_VIDEO_BUCKET,
} from "@/lib/interpreter-photos";

type Props = {
  userId: string;
  fullName: string;
  currentPhotoPath: string | null;
  currentPhotoUrl: string | null;
  currentVideoPath: string | null;
  currentVideoUrl: string | null;
};

type MediaKind = "photo" | "video";

const MEDIA_RULES = {
  photo: {
    bucket: INTERPRETER_PHOTO_BUCKET,
    maxBytes: 5 * 1024 * 1024,
    allowed: new Map([
      ["image/jpeg", "jpg"],
      ["image/png", "png"],
      ["image/webp", "webp"],
    ]),
  },

  video: {
    bucket: INTERPRETER_VIDEO_BUCKET,
    maxBytes: 50 * 1024 * 1024,
    allowed: new Map([
      ["video/mp4", "mp4"],
      ["video/webm", "webm"],
      ["video/quicktime", "mov"],
    ]),
  },
};

export function ProfileMediaUploader({
  userId,
  fullName,
  currentPhotoPath,
  currentPhotoUrl,
  currentVideoPath,
  currentVideoUrl,
}: Props) {
  const supabase = useMemo(
    () => createSupabaseBrowserClient(),
    []
  );

  const [photoPath, setPhotoPath] = useState(
    currentPhotoPath ?? ""
  );

  const [photoUrl, setPhotoUrl] = useState(
    currentPhotoUrl ?? ""
  );

  const [videoPath, setVideoPath] = useState(
    currentVideoPath ?? ""
  );

  const [videoUrl, setVideoUrl] = useState(
    currentVideoUrl ?? ""
  );

  const [removePhoto, setRemovePhoto] =
    useState(false);

  const [removeVideo, setRemoveVideo] =
    useState(false);

  const [uploading, setUploading] =
    useState<MediaKind | null>(null);

  const [error, setError] = useState("");

  async function uploadMedia(
    file: File,
    kind: MediaKind
  ) {
    setError("");

    const rules = MEDIA_RULES[kind];
    const extension = rules.allowed.get(file.type);

    if (!extension) {
      setError(
        kind === "photo"
          ? "Profile photo must be a JPG, PNG, or WebP image."
          : "Introduction video must be an MP4, WebM, or MOV file."
      );
      return;
    }

    if (file.size > rules.maxBytes) {
      setError(
        kind === "photo"
          ? "Profile photo must be 5 MB or smaller."
          : "Introduction video must be 50 MB or smaller."
      );
      return;
    }

    setUploading(kind);

    const path =
      `${userId}/${kind}-${Date.now()}-` +
      `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from(rules.bucket)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      setError(
        `Could not upload ${kind}: ${uploadError.message}`
      );
      setUploading(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (kind === "photo") {
      if (
        photoPath &&
        photoPath !== currentPhotoPath
      ) {
        await supabase.storage
          .from(INTERPRETER_PHOTO_BUCKET)
          .remove([photoPath]);
      }

      setPhotoPath(path);
      setPhotoUrl(previewUrl);
      setRemovePhoto(false);
    } else {
      if (
        videoPath &&
        videoPath !== currentVideoPath
      ) {
        await supabase.storage
          .from(INTERPRETER_VIDEO_BUCKET)
          .remove([videoPath]);
      }

      setVideoPath(path);
      setVideoUrl(previewUrl);
      setRemoveVideo(false);
    }

    setUploading(null);
  }

  async function removePendingMedia(
    kind: MediaKind
  ) {
    setError("");

    if (kind === "photo") {
      if (
        photoPath &&
        photoPath !== currentPhotoPath
      ) {
        await supabase.storage
          .from(INTERPRETER_PHOTO_BUCKET)
          .remove([photoPath]);
      }

      setPhotoPath("");
      setPhotoUrl("");
      setRemovePhoto(true);
      return;
    }

    if (
      videoPath &&
      videoPath !== currentVideoPath
    ) {
      await supabase.storage
        .from(INTERPRETER_VIDEO_BUCKET)
        .remove([videoPath]);
    }

    setVideoPath("");
    setVideoUrl("");
    setRemoveVideo(true);
  }

  return (
    <fieldset className="rounded-xl border border-slate-200 p-4 space-y-5">
      <legend className="px-2 text-sm font-medium">
        Profile media
      </legend>

      <input
        type="hidden"
        name="profile_photo_path"
        value={photoPath}
      />

      <input
        type="hidden"
        name="remove_profile_photo"
        value={removePhoto ? "on" : ""}
      />

      <input
        type="hidden"
        name="intro_video_path"
        value={videoPath}
      />

      <input
        type="hidden"
        name="remove_intro_video"
        value={removeVideo ? "on" : ""}
      />

      <div>
        <label
          className="label"
          htmlFor="profile_photo"
        >
          Profile photo
        </label>

        {photoUrl && (
          <div className="mb-3 flex items-center gap-3">
            <img
              src={photoUrl}
              alt={`${fullName} profile`}
              className="h-20 w-20 rounded-full border border-slate-200 object-cover"
            />

            <button
              type="button"
              onClick={() =>
                removePendingMedia("photo")
              }
              className="text-sm text-rose-600 underline"
            >
              Remove current photo
            </button>
          </div>
        )}

        <input
          id="profile_photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="input"
          disabled={uploading !== null}
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              void uploadMedia(file, "photo");
            }
          }}
        />

        <p className="mt-1 text-xs text-ink-muted">
          JPG, PNG, or WebP. Maximum size 5 MB.
        </p>
      </div>

      <div>
        <label
          className="label"
          htmlFor="intro_video"
        >
          ASL introduction video
        </label>

        {videoUrl && (
          <div className="mb-3 space-y-2">
            <video
              src={videoUrl}
              controls
              preload="metadata"
              className="w-full max-w-md rounded-xl border border-slate-200 bg-black"
            >
              Your browser does not support video
              playback.
            </video>

            <button
              type="button"
              onClick={() =>
                removePendingMedia("video")
              }
              className="block text-sm text-rose-600 underline"
            >
              Remove current video
            </button>
          </div>
        )}

        <input
          id="intro_video"
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="input"
          disabled={uploading !== null}
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              void uploadMedia(file, "video");
            }
          }}
        />

        <p className="mt-1 text-xs text-ink-muted">
          MP4, WebM, or MOV. Maximum size 50 MB.
          Requesters see this video only when you are
          proposed for their request.
        </p>
      </div>

      {uploading && (
        <p className="text-sm text-brand-700">
          Uploading {uploading}… Please wait before
          saving.
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}
