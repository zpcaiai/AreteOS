import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Replaces the deprecated `package.json#prisma` key (which Prisma 7 will remove).
// The schema is the multi-file folder prisma/schema/. `prisma db seed` runs the
// full seed chain (base + genius + identity + cognitive + worldview + audiobooks
// + emporion + naval).
export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    seed: "tsx prisma/seed.ts && tsx prisma/seed-genius.ts && tsx prisma/seed-identity.ts && tsx prisma/seed-cognitive.ts && tsx prisma/seed-worldview.ts && tsx prisma/seed-audiobooks.ts && tsx prisma/seed-emporion.ts && tsx prisma/seed-naval.ts",
  },
});
