import { v2 as cloudinary } from "cloudinary";

// ─── Cloudinary helper (server-only) ─────────────────────────────────────────
// Configures the Cloudinary SDK once and exports it for use inside API routes
// (uploads, signed URLs, transformations). Client components should use the
// `<CldImage>` and `<CldUploadWidget>` components from `next-cloudinary` instead
// — they read the public cloud name from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
// don't need this server-side config.
//
// Env vars (all in .env.local):
//   CLOUDINARY_API_KEY              — server-only, used to sign uploads
//   CLOUDINARY_API_SECRET           — server-only, NEVER exposed to browser
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME — public, safe to expose

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export { cloudinary };
