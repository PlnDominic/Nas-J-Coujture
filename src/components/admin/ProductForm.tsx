"use client";

import { useActionState, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import { deleteProductImage } from "@/app/admin/(dashboard)/products/actions";
import type { Category, ProductWithImages } from "@/types/database";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: ProductWithImages;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [newUrls, setNewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState(
    (product?.product_images ?? []).map((img) => ({ id: img.id, url: img.url })),
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Name</label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Slug</label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm outline-none focus:border-brand"
        />
        <p className="mt-1 text-xs text-muted-foreground">Used in the product URL: /products/{slug || "…"}</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Price (GHS)</label>
          <input
            name="priceCents"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={product ? product.price_cents / 100 : undefined}
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Compare-at price (optional)</label>
          <input
            name="compareAtPriceCents"
            type="number"
            min={0}
            step={1}
            defaultValue={
              product?.compare_at_price_cents ? product.compare_at_price_cents / 100 : undefined
            }
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Stock</label>
          <input
            name="stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={product?.stock ?? 0}
            onWheel={(e) => e.currentTarget.blur()}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Category</label>
          <select
            name="categoryId"
            defaultValue={product?.category_id ?? ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Sizes</label>
          <input
            name="sizes"
            placeholder="S, M, L, XL"
            defaultValue={product?.sizes.join(", ") ?? ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Colors</label>
          <input
            name="colors"
            placeholder="Indigo, Rust"
            defaultValue={product?.colors.join(", ") ?? ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated</p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Images</label>
        <ImageUploader
          existingImages={existingImages}
          onDeleteExisting={async (id) => {
            setExistingImages((imgs) => imgs.filter((i) => i.id !== id));
            await deleteProductImage(id);
          }}
          newUrls={newUrls}
          onNewUrlsChange={setNewUrls}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={product?.is_published ?? true}
          className="h-4 w-4 rounded border-border accent-[var(--brand)]"
        />
        Published (visible in the storefront)
      </label>

      {error && (
        <p className="rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
