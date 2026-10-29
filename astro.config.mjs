// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages serves a project repo at https://<user>.github.io/<repo>/.
// The deploy workflow sets SITE and BASE_PATH; locally the site runs at /.
// With a custom domain, set BASE_PATH to "/" in the workflow (or delete it).
export default defineConfig({
  site: process.env.SITE ?? 'https://jeffbasso.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
});
