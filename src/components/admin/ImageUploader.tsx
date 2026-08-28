"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ExistingImage {
  id: string;
  url: string;
}

export default function ImageUploader({
  existingImages = [],
  onDeleteExisting,
  newUrls,
  onNewUrlsChange,
}: {
  existingImages?: ExistingImage[];
  onDeleteExisting?: (id: string) => void;
  newUrls: string[];
  onNewUrlsChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    onNewUrlsChange([...newUrls, ...uploaded]);
    setUploading(false);
  }

  return (
    <div>
      <input type="hidden" name="imageUrls" value={newUrls.join(",")} />

      {(existingImages.length > 0 || newUrls.length > 0) && (
        <div className="mb-3 grid grid-cols-4 gap-3">
          {existingImages.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image src={img.url} alt="" fill className="object-cover" />
              {onDeleteExisting && (
                <button
                  type="button"
                  onClick={() => onDeleteExisting(img.id)}
                  className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-foreground/80 text-xs text-background group-hover:flex"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {newUrls.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onNewUrlsChange(newUrls.filter((u) => u !== url))}
                className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-foreground/80 text-xs text-background group-hover:flex"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center rounded-lg border border-dashed border-border px-4 py-2.5 text-sm transition hover:border-brand">
        {uploading ? "Uploading…" : "Upload images"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 text-sm text-brand">{error}</p>}
    </div>
  );
}
